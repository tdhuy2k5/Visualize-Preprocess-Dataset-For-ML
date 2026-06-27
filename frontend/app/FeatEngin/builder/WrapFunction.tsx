import React, { useEffect, useState } from "react";
import PassiveFunction from "./PassiveFunction";
import ActiveFunction from "./ActiveFunction";

export type Func = {
  id: string;
  type: string;
  param?: string;
};

const WrapFunction = function ({
  setWrapFunctions,
}: {
  setWrapFunctions: (wrapFunctions: Func[]) => void;
}) {
  const template = { id: crypto.randomUUID(), type: "pow", param: "2" };
  const [funcs, setFuncs] = useState<Func[]>([template]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Func | null>(null);
  useEffect(() => {
    setWrapFunctions(funcs);
  }, [funcs]);
  function removeFuncHandler(
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) {
    e.stopPropagation();
    setFuncs((prev) => prev.filter((_, i) => i !== index));
  }
  function editFuncHandler(fn: Func, index: number) {
    setEditingIndex(index);
    setDraft(fn);
  }
  function cancelFuncHandler() {
    setEditingIndex(null);
    setDraft(null);
  }
  function updateDraftParamHandler(value: string) {
    if (!draft) {
      return;
    }
    setDraft({ ...draft, param: value });
  }
  function updateDraftTypeHandler(value: string) {
    if (!draft) {
      return;
    }
    setDraft({ ...draft, type: value });
  }
  function saveFuncHandler(index: number) {
    if (!draft || !draft.param) {
      return;
    }
    if (index < funcs.length) {
      const updated = [...funcs];
      updated[index] = draft;
      setFuncs(updated);
      setEditingIndex(null);
      setDraft(null);
      return true;
    }
    setFuncs([...funcs, draft]);
    setEditingIndex(null);
    setDraft(null);
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
          <span
            className="material-symbols-outlined text-base"
            data-icon="reorder"
          >
            reorder
          </span>
          Functions applied (top → bottom)
        </h2>
      </div>
      <div className="space-y-3">
        {funcs.map((fn: Func, index: number) => {
          const isEditing = editingIndex === index;

          if (isEditing && draft) {
            return (
              <ActiveFunction
                index={index}
                draft={draft}
                cancelFuncHandler={cancelFuncHandler}
                updateDraftParamHandler={updateDraftParamHandler}
                saveFuncHandler={saveFuncHandler}
                updateDraftTypeHandler={updateDraftTypeHandler}
              ></ActiveFunction>
            );
          }

          // PASSIVE VIEW (your "1." UI)
          return (
            <PassiveFunction
              fn={fn}
              index={index}
              editFuncHandler={editFuncHandler}
              removeFuncHandler={removeFuncHandler}
            ></PassiveFunction>
          );
        })}
        {editingIndex !== null && editingIndex === funcs.length && draft && (
          <ActiveFunction
            index={editingIndex}
            draft={draft}
            cancelFuncHandler={cancelFuncHandler}
            updateDraftParamHandler={updateDraftParamHandler}
            saveFuncHandler={saveFuncHandler}
            updateDraftTypeHandler={updateDraftTypeHandler}
          ></ActiveFunction>
        )}
      </div>
      <button
        onClick={() => {
          setEditingIndex(funcs.length);
          setDraft(template);
        }}
        className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 group"
      >
        <span
          className="material-symbols-outlined group-hover:scale-110 transition-transform"
          data-icon="add_circle"
        >
          add_circle
        </span>
        <span className="text-sm font-semibold">Add Function</span>
      </button>
    </div>
  );
};
export default WrapFunction;
