import { useEffect, useState } from "react";
import { formatSize } from "./helper";

const UploadedModal = function ({ onClose }: { onClose: VoidFunction }) {
  const [fileList, setFileList] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [progressList, setProgressList] = useState<number[]>([]);
  const MAXFILESIZE = 50;
  useEffect(() => {
    // Prevent if drag is file
    window.addEventListener("drop", (e: DragEvent) => {
      if (!e.dataTransfer?.files.length) {
        e.preventDefault();
      }
    });
    window.addEventListener("dragover", (e: DragEvent) => {
      if (!e.dataTransfer?.files.length) {
        e.preventDefault();
      }
    });
  });
  function dropHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!e.dataTransfer?.files) {
      return;
    }
    const files = [...e.dataTransfer.files];
    setFileList(files);
  }
  function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    const fileItems = [...e.dataTransfer.files];
    if (fileItems.length > 0) {
      e.preventDefault();
      if (
        fileItems.some(
          (item) =>
            item.name.endsWith(".csv") &&
            fileItems.some((item) => item.size <= MAXFILESIZE * 1024 * 1024),
        )
      ) {
        e.dataTransfer.dropEffect = "copy";
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    }
  }
  function uploadHandler(file: File) {
    const ws = new WebSocket("ws://localhost:8000/dataset/upload");

    ws.onopen = () => {
      ws.send(file.name);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ready") {
        const chunkSize = 100 * 1024;
        let offset = 0;

        const reader = new FileReader();

        reader.onload = (e) => {
          if (e.target?.result) {
            ws.send(e.target.result as ArrayBuffer);
            offset += chunkSize;

            if (offset < file.size) {
              readNextChunk();
            } else {
              ws.send("done");
            }
          }
        };

        function readNextChunk() {
          const slice = file.slice(offset, offset + chunkSize);
          reader.readAsArrayBuffer(slice);
        }

        readNextChunk();
      }
      if (data.type === "error") {
        setProgressList([]);
        setError(data.message);
      }
      if (data.type === "progress") {
        setProgressList([data.uploaded_bytes]);
      }
    };
  }
  return (
    <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center">
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 backdrop-blur-md p-4"
        onClick={() => {
          onClose();
        }}
      >
        <div
          className="w-full max-w-2xl bg-surface-container-low rounded-xl overflow-hidden flex flex-col border border-outline-variant/20 shadow-2xl"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="px-8 py-6 flex items-center justify-between bg-surface-container-lowest">
            <div>
              <h2 className="text-2xl font-headline font-extrabold text-white tracking-tight">
                Import New Dataset
              </h2>
              <p className="text-on-surface-variant text-sm font-body mt-0.5">
                Define your source and map data to the environment.
              </p>
            </div>
            <button
              className="text-on-surface-variant hover:text-white transition-colors"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>

          <div className="flex border-b border-outline-variant/10 bg-surface-container-lowest/50">
            <button className="px-8 py-4 text-primary border-b-2 border-primary font-medium flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-lg">
                upload_file
              </span>
              Local File
            </button>
          </div>

          <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
            <div
              className="group relative flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40 hover:border-primary/60 bg-surface-container hover:bg-surface-bright/20 transition-all rounded-xl py-12 px-6 cursor-pointer"
              onDrop={dropHandler}
              onDragOver={dragOverHandler}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined text-primary text-4xl"
                  data-weight="fill"
                >
                  upload
                </span>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-headline font-bold text-white">
                  Drag &amp; drop your dataset here
                </p>
                <p className="text-on-surface-variant text-sm">
                  or{" "}
                  <label className="text-primary hover:underline">
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.target.files && setFileList([...e.target.files]);
                      }}
                    />
                    browse files
                  </label>{" "}
                  from your workstation
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <span className="px-2 py-1 rounded bg-surface-container-highest text-[10px] text-on-surface-variant border border-outline-variant/20 uppercase font-bold">
                    .csv
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-inter uppercase tracking-widest text-on-surface-variant font-bold">
                  Recent Uploads
                </h3>
                <span className="text-[10px] text-primary/60 cursor-pointer hover:text-primary transition-colors">
                  Clear all
                </span>
              </div>
              <div className="space-y-3">
                {fileList.map((file) => (
                  <div className="bg-surface-container-high rounded-lg p-4 flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded bg-tertiary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary text-xl">
                        description
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-on-surface">
                          {file.name}
                        </span>
                        {progressList[0] && (
                          <span className="text-xs text-primary">
                            {(progressList[0] / file.size) * 100}%
                          </span>
                        )}
                      </div>
                      {progressList[0] ? (
                        <div className="h-1.5 w-full bg-surface-dim rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-primary to-on-primary-container"
                            style={{
                              width: `${(progressList[0] / file.size) * 100}%`,
                            }}
                          ></div>
                        </div>
                      ) : (
                        <p className="text-[9px] text-on-surface-variant tabular-nums">
                          {formatSize(file.size)}
                        </p>
                      )}
                      {error !== "" && (
                        <p className="text-sm font-medium text-error">
                          {error}
                        </p>
                      )}
                    </div>
                    <button className="text-on-surface-variant hover:text-green-200 transition-colors p-1 opacity-0 group-hover:opacity-100">
                      <span
                        className="material-symbols-outlined text-lg"
                        onClick={() => {
                          uploadHandler(file);
                        }}
                      >
                        upload
                      </span>
                    </button>
                    <button className="text-on-surface-variant hover:text-error transition-colors p-1 opacity-0 group-hover:opacity-100">
                      <span
                        className="material-symbols-outlined text-lg"
                        onClick={() => {
                          setFileList(
                            fileList.filter((f) => f.name !== file.name),
                          );
                        }}
                      >
                        cancel
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-surface-container-lowest border-t border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-4 text-on-surface-variant text-xs">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  security
                </span>{" "}
                Encrypted Transport
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  storage
                </span>{" "}
                50 MB Max
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 rounded-md text-secondary hover:bg-surface-variant/20 transition-all font-medium text-sm">
                Cancel
              </button>
              <button className="px-6 py-2.5 rounded-md bg-linear-to-br from-primary to-on-primary-container text-on-primary font-bold text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all">
                Parse &amp; Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UploadedModal;
