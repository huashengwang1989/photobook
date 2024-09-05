import { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { exportMultipleCanvasesToImages } from './canvasCommon/exportToImage';
import type { CanvasToImageExportOptions } from '../partials/canvasCommon/types';

const buttonCls = clsx(
  'radui ml-1 rounded-sm border-slate-800 bg-white p-1 text-sm shadow-sm hover:border-lime-600 hover:bg-lime-100 disabled:bg-slate-400 disabled:text-slate-600 dark:border-slate-300 dark:disabled:bg-slate-500 dark:disabled:text-slate-400',
);

const Header = (props: {
  allCanvasIds: string[],
  exportOptions: Omit<CanvasToImageExportOptions, 'exportingCanvasIds'>,
  onFirstBlankPageToggle: (on: boolean) => void,
  firstBlankPageEnabled: boolean,
  onTwoPerRowViewToggle: (on: boolean) => void,
  isTwoPerRowView: boolean,
  onAutoInsetBlankPageToCloseASectionAtTwoPerRowViewToggle: (
    on: boolean,
  ) => void,
  isAutoInsetBlankPageToCloseASectionAtTwoPerRowView: boolean,
}) => {
  const {
    allCanvasIds,
    exportOptions,
    onFirstBlankPageToggle,
    firstBlankPageEnabled,
    onTwoPerRowViewToggle,
    isTwoPerRowView,
    onAutoInsetBlankPageToCloseASectionAtTwoPerRowViewToggle,
    isAutoInsetBlankPageToCloseASectionAtTwoPerRowView,
  } = props;

  // Export All stage and progress
  const [stage, setStage] = useState('');
  const [pgs, setPgs] = useState(0);

  const genToggleButton = useCallback(
    (btnState: boolean, setBtnState: (b: boolean) => void, label: string) => {
      const onClick = () => {
        setBtnState(!btnState);
      };

      const offCls = clsx(buttonCls, 'opacity-75');

      return (
        <button
          className={!btnState ? offCls : buttonCls}
          disabled={!allCanvasIds.length}
          onClick={onClick}
        >
          {label}
        </button>
      );
    },
    [allCanvasIds.length],
  );

  const ExportAllStatusIndicator = useMemo(() => {
    if (!stage) {
      return null;
    }
    return `${stage} - ${Math.round(pgs * 1000) / 10}%`;
  }, [pgs, stage]);

  const ExportAllButton = useMemo(() => {
    const onClick = () => {
      exportMultipleCanvasesToImages(allCanvasIds, {
        exportOptions,
        exportStartCallback: () => {
          setStage('');
          setPgs(0);
        },
        exportEndCallback: () => {
          setStage('');
          setPgs(0);
        },
        onExportIntermediateCallback: (opt) => {
          setStage(opt.stage);
          setPgs(opt.progress);
        },
      });
    };
    return (
      <button
        className={buttonCls}
        disabled={!allCanvasIds.length}
        onClick={onClick}
      >
        {`Export All (${allCanvasIds.length} Pages)`}
      </button>
    );
  }, [allCanvasIds, exportOptions]);

  const FirstBlankPageToggle = useMemo(
    () =>
      genToggleButton(
        firstBlankPageEnabled,
        onFirstBlankPageToggle,
        'First Blank Page',
      ),
    [firstBlankPageEnabled, genToggleButton, onFirstBlankPageToggle],
  );

  const TwoPerRowViewToggle = useMemo(
    () => genToggleButton(isTwoPerRowView, onTwoPerRowViewToggle, '2/Row'),
    [genToggleButton, isTwoPerRowView, onTwoPerRowViewToggle],
  );

  const AntoSectionViewToggle = useMemo(
    () =>
      genToggleButton(
        isAutoInsetBlankPageToCloseASectionAtTwoPerRowView,
        onAutoInsetBlankPageToCloseASectionAtTwoPerRowViewToggle,
        'Sectioning When 2/Row',
      ),
    [
      genToggleButton,
      isAutoInsetBlankPageToCloseASectionAtTwoPerRowView,
      onAutoInsetBlankPageToCloseASectionAtTwoPerRowViewToggle,
    ],
  );

  return (
    <div className="supports-backdrop-blur:bg-white/95 sticky top-0 z-40 w-full flex-none bg-white backdrop-blur transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] dark:bg-slate-900/75">
      <div className="max-w-8xl mx-auto flex">
        <div className="mx-4 flex border-b border-slate-900/10 py-4 lg:mx-0 lg:border-0 lg:px-8 dark:border-slate-300/10">
          <div className="relative flex flex-grow items-center">
            Photoboook Maker
          </div>
          <div className="relative flex flex-grow-0 items-center">
            {ExportAllButton}
            {FirstBlankPageToggle}
            {TwoPerRowViewToggle}
            {AntoSectionViewToggle}
          </div>
          <div className="relative ml-1 flex flex-grow-0 items-center">
            {ExportAllStatusIndicator}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
