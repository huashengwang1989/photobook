import Header from './partials/Header';
import { useCanvasMulti } from './partials/CanvasMulti';
import { CanvasToImageExportOptions } from './partials/canvasCommon/types';

import './App.css';

const exportOptions: CanvasToImageExportOptions = {
  isToExport: false,
  inclBleedingArea: true,
  inclBleedingMarks: true,
  targetDpi: 300,
  exportFormat: 'jpg',
};

function App() {
  const { CanvasMultiRendered } = useCanvasMulti({
    exportOptions,
  });
  return (
    <div className="bg-white text-slate-500 antialiased dark:bg-slate-900 dark:text-slate-400">
      <Header />
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
