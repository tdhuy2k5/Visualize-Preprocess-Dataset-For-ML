import { useNavigate } from "react-router";

const HeaderPreprocessing = function ({
  title,
  desc,
  nextStep,
  stepNumber,
}: {
  title: string;
  desc: string;
  nextStep: string;
  stepNumber: number;
}) {
  const navigate = useNavigate();
  return (
    <header className="p-4 flex items-center justify-between px-8 rounded-xl bg-surface-container-low shrink-0 border border-white/5 border-l-amber- mb-8">
      <div className="flex items-center gap-4">
        <button
          className="p-2 hover:bg-surface-variant/40 rounded-full transition-colors"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            arrow_back
          </span>
        </button>
        <div>
          <h1 className="text-xl font-headline font-extrabold text-white tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-sm text-on-surface-variant tracking-tight mb-2 max-w-2xl">
            {desc}
          </p>
          <p className="text-xs text-on-background font-medium tracking-tight">
            Step 0{stepNumber} • Preprocessing Pipeline
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          className="p-6 rounded-md bg-primary text-on-primary text-xs font-bold hover:bg-surface-tint transition-colors"
          onClick={() => navigate(nextStep)}
        >
          Next Step
        </button>
      </div>
    </header>
  );
};
export default HeaderPreprocessing;
