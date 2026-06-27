const PreviewExpression = function ({ expr }: { expr: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
        <span
          className="material-symbols-outlined text-base"
          data-icon="terminal"
        >
          terminal
        </span>
        Final Compiled Expression
      </h2>
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-inner relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <button className="text-on-surface-variant hover:text-white transition-colors">
            <span
              className="material-symbols-outlined"
              data-icon="content_copy"
            >
              content_copy
            </span>
          </button>
        </div>
        <code className="text-lg font-mono leading-relaxed block">
          <span>{expr}</span>
        </code>
        <div className="mt-6 flex items-center gap-4 text-[10px] text-on-surface-variant font-bold uppercase">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary/40"></span> Syntax
            Validated
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary/40"></span> 2
            Transformations
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success/40"></span> Ready
            for Execution
          </span>
        </div>
      </div>
    </div>
  );
};
export default PreviewExpression;
