const SearchBox = function ({ placeholder }: { placeholder: string }) {
  return (
    <div className="px-4 py-3 bg-surface-container flex items-center gap-2">
      <span className="material-symbols-outlined text-sm text-slate-400">
        search
      </span>
      <input
        className="bg-transparent border-none text-[10px] text-on-surface focus:ring-0 w-full placeholder:text-slate-400"
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
};
export default SearchBox;
