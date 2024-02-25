import { useMemo } from 'react';
import Header from './partials/Header';
import { useCanvasMulti } from './partials/CanvasMulti';
import type { CanvasToImageExportOptions } from './partials/canvasCommon/types';

import './App.css';

const exportOptions: CanvasToImageExportOptions = {
  exportingCanvasIds: [],
  inclBleedingArea: true,
  inclBleedingMarks: false,
  targetDpi: 300,
  exportFormat: 'jpg',
};

function App() {
  const { CanvasMultiRendered, calendarCanvasIds, activityCanvasIds } =
    useCanvasMulti({
      exportOptions,
    });

  const allCanvasIds = useMemo(
    () => [...calendarCanvasIds, ...activityCanvasIds],
    [activityCanvasIds, calendarCanvasIds],
  );

  return (
    <div className="bg-white text-slate-500 antialiased dark:bg-slate-900 dark:text-slate-400">
      <Header allCanvasIds={allCanvasIds} exportOptions={exportOptions} />
      <div>
        <div className="min-h-lvh bg-slate-500 dark:bg-slate-700">
          <main className="relative mx-auto flex max-w-3xl pt-10 xl:max-w-none">
            {CanvasMultiRendered}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
