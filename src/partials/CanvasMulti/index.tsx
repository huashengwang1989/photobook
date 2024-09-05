import { useMemo, useState } from 'react';
import clsx from 'clsx';

import { useCanvasBaseAndDim } from '../canvasBaseAndDim';

import { useCalPages } from './canvasEffects/calendar';
import { useAvtivityPages } from './canvasEffects/activity';

import type { MergedConfigs } from './types';

const defaultIgnoredExtensions: string[] = [];

const normaliseThemeColor = (input: string | undefined) => {
  if (input && input.startsWith('text-')) {
    return { themeColor: undefined, themeClassName: input };
  }
  return { themeColor: input, themeClassName: undefined };
};

function useCanvasMulti(props: {
  project: MergedConfigs,
  toggles: {
    firstBlankPageEnabled: boolean,
    twoPerRowView: boolean,
    isAutoSectioning: boolean,
  },
}) {
  const { project, toggles } = props;

  const {
    exportOptions,
    canvasOptions,
    themeColor: themeColorRaw,
    themeColorMinor: themeColorMinorRaw,
  } = project;

  const theme = useMemo(() => {
    const { themeColor, themeClassName } = normaliseThemeColor(themeColorRaw);
    const { themeColor: themeColorMinor, themeClassName: themeClassNameMinor } =
      normaliseThemeColor(themeColorMinorRaw);

    return {
      themeColor,
      themeClassName,
      themeColorMinor,
      themeClassNameMinor,
    };
  }, [themeColorMinorRaw, themeColorRaw]);

  // TODO: future to sync status
  const [exportingCanvasIds] = useState<string[]>([]);

  const mergedExportOptions = useMemo(
    () => ({
      ...exportOptions,
      exportingCanvasIds,
    }),
    [exportOptions, exportingCanvasIds],
  );

  const { renderCanvas: renderBlankCanvas } = useCanvasBaseAndDim({
    exportOptions: mergedExportOptions,
    noExport: true,
    exportUniqueId: 'blank',
    ...canvasOptions,
  });

  // ---- Calendar Canvas ----
  const { calCanvases, calCanvasIds } = useCalPages({
    theme,
    exportOptions: mergedExportOptions,
    baseFolder: project.baseFolders.calendar,
    ignoredExtensions: project.ignoreFileExtensions || defaultIgnoredExtensions,
    canvasOptions: project.canvasOptions,
    calendarConfigs: project.pageConfig.calendar,
  });
  const { activityCanvasesGrouped, activityCanvasIds } = useAvtivityPages({
    theme,
    exportOptions: mergedExportOptions,
    baseFolder: project.baseFolders.activity,
    ignoredExtensions: project.ignoreFileExtensions || defaultIgnoredExtensions,
    canvasOptions: project.canvasOptions,
    pageAdjust: project.pageAdjust.activity,
  });

  const needsBlankInsetAfterCal =
    toggles.twoPerRowView &&
    toggles.isAutoSectioning &&
    (calCanvases.length + (toggles.firstBlankPageEnabled ? 1 : 0)) % 2 === 1;

  const needsBlankInsetAfterActivity =
    toggles.twoPerRowView &&
    toggles.isAutoSectioning &&
    activityCanvasesGrouped.length % 2 === 1;

  const allCanvas = useMemo(() => {
    const rb = (idAppend: string, key: string) => [
      renderBlankCanvas({
        children: null,
        idAppend,
        key,
      }).canvas,
    ];

    const rbToggle = (toggle: boolean) => (toggle ? rb : () => []);
    return ([] as React.ReactNode[]).concat(
      rbToggle(toggles.firstBlankPageEnabled)('first', 'first-blank'),
      calCanvases,
      rbToggle(needsBlankInsetAfterCal)('cal-end', 'cal-end'),
      activityCanvasesGrouped,
      rbToggle(needsBlankInsetAfterActivity)('activity-end', 'activity-end'),
    );
  }, [
    activityCanvasesGrouped,
    calCanvases,
    needsBlankInsetAfterActivity,
    needsBlankInsetAfterCal,
    renderBlankCanvas,
    toggles.firstBlankPageEnabled,
  ]);

  const allCanvasTwoPerRow = useMemo(
    () =>
      allCanvas.reduce<React.ReactNode[][]>((acc, el, i) => {
        if (i % 2 === 0) {
          acc.push([]);
        }
        const rowIdx = Math.floor(i / 2);
        acc[rowIdx].push(el);
        return acc;
      }, []),
    [allCanvas],
  );

  const allCanvasTwoPerRowRendered = useMemo(() => {
    return allCanvasTwoPerRow.map((els, i) => {
      return (
        <div
          key={`row-${i}`}
          className={'flex flex-row flex-nowrap justify-center'}
        >
          {els}
        </div>
      );
    });
  }, [allCanvasTwoPerRow]);

  const CanvasMultiRendered = useMemo(() => {
    return (
      <div
        className={clsx(
          toggles.twoPerRowView ? 'flex-col overflow-x-auto' : 'flex-wrap',
          'canvas-container flex justify-center',
        )}
      >
        {toggles.twoPerRowView ? allCanvasTwoPerRowRendered : allCanvas}
      </div>
    );
  }, [allCanvas, allCanvasTwoPerRowRendered, toggles.twoPerRowView]);

  const output = useMemo(
    () => ({
      CanvasMultiRendered,
      calendarCanvasIds: calCanvasIds,
      activityCanvasIds,
    }),
    [CanvasMultiRendered, activityCanvasIds, calCanvasIds],
  );

  return output;
}

export { useCanvasMulti };
