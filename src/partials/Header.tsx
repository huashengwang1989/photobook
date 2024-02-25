import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { exportMultipleCanvasesToImages } from './canvasCommon/exportToImage';
import type { CanvasToImageExportOptions } from '../partials/canvasCommon/types';

const Header = (props: {
  allCanvasIds: string[],
  exportOptions: CanvasToImageExportOptions,
}) => {
  const { allCanvasIds, exportOptions } = props;

  const [stage, setStage] = useState('');
  const [pgs, setPgs] = useState(0);

  const StatusIndicator = useMemo(() => {
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
    const cls = clsx(
      'radui ml-1 rounded-sm border-slate-800 bg-white p-1 text-sm shadow-sm hover:border-lime-600 hover:bg-lime-100 disabled:bg-slate-400 disabled:text-slate-600 dark:border-slate-300 dark:disabled:bg-slate-500 dark:disabled:text-slate-400',
    );
    return (
      <button className={cls} disabled={!allCanvasIds.length} onClick={onClick}>
        {`Export All (${allCanvasIds.length} Pages)`}
      </button>
    );
  }, [allCanvasIds, exportOptions]);

  return (
    <div className="supports-backdrop-blur:bg-white/95 sticky top-0 z-40 w-full flex-none bg-white backdrop-blur transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] dark:bg-slate-900/75">
      <div className="max-w-8xl mx-auto flex">
        <div className="mx-4 flex border-b border-slate-900/10 py-4 lg:mx-0 lg:border-0 lg:px-8 dark:border-slate-300/10">
          <div className="relative flex flex-grow items-center">
            Photoboook Maker
          </div>
          <div className="relative flex flex-grow-0 items-center">
            {ExportAllButton}
          </div>
          <div className="relative flex flex-grow-0 items-center">
            {StatusIndicator}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
