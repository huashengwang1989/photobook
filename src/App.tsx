import { useMemo, useState } from 'react';
import Header from './partials/Header';
import { useCanvasMulti } from './partials/CanvasMulti';

import { defaultSelectedProject } from './projects';

function App() {
  // View controls
  const [firstBlankPageEnabled, setFirstBlankPageEnabled] = useState(true);
  const [twoPerRowView, setTwoPerRowView] = useState(true);
  const [isAutoSectioning, setIsAutoSectioning] = useState(true);

  const toggles = useMemo(
    () => ({ firstBlankPageEnabled, twoPerRowView, isAutoSectioning }),
    [firstBlankPageEnabled, isAutoSectioning, twoPerRowView],
  );

  const { CanvasMultiRendered, calendarCanvasIds, activityCanvasIds } =
    useCanvasMulti({
      project: defaultSelectedProject,
      toggles,
    });

  const allCanvasIds = useMemo(
    () => [...calendarCanvasIds, ...activityCanvasIds],
    [activityCanvasIds, calendarCanvasIds],
  );

  return (
    <div className="bg-white text-slate-500 antialiased dark:bg-slate-900 dark:text-slate-400">
      <Header
        allCanvasIds={allCanvasIds}
        exportOptions={defaultSelectedProject.exportOptions}
        firstBlankPageEnabled={firstBlankPageEnabled}
        onFirstBlankPageToggle={setFirstBlankPageEnabled}
        isTwoPerRowView={twoPerRowView}
        onTwoPerRowViewToggle={setTwoPerRowView}
        isAutoInsetBlankPageToCloseASectionAtTwoPerRowView={isAutoSectioning}
        onAutoInsetBlankPageToCloseASectionAtTwoPerRowViewToggle={
          setIsAutoSectioning
        }
      />
      <div>
        <div className="min-h-lvh bg-slate-500 dark:bg-slate-700">
          <main className="relative mx-auto flex pt-10 xl:max-w-none">
            {CanvasMultiRendered}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
