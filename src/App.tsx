import Header from './partials/Header';

import './App.css';

function App() {
  return (
    <div className="bg-white text-slate-500 antialiased dark:bg-slate-900 dark:text-slate-400">
      <Header />
      <div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="fixed inset-0 left-[max(0px,calc(50%-45rem))] right-auto top-[3.8125rem] z-20 hidden w-[19rem] overflow-y-auto pb-10 pl-8 pr-6 lg:block">
            Side
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
