"use client";

/**
 * Client-side "with photos vs. text only" preview for the client walkthrough.
 *
 * Activated only when a page is loaded with `?preview` in the URL, so it never
 * shows for a regular visitor. `?preview=text` starts on the text-only design;
 * `?preview` (or `?preview=photos`) starts on the photo design. A floating
 * toggle then switches between the two live.
 *
 * Components under the provider read `usePreviewMode()` and render either their
 * image layout or a dedicated text-only component. This is a temporary demo
 * aid — remove the provider from the layout and the branches to retire it.
 */
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type PreviewMode = "photos" | "text";

const PreviewContext = createContext<PreviewMode>("photos");

export function usePreviewMode(): PreviewMode {
  return useContext(PreviewContext);
}

/** Initial mode from the URL, without tripping hydration — server sees "", client the real value. */
function useUrlMode(): PreviewMode {
  const search = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  return new URLSearchParams(search).get("preview") === "text" ? "text" : "photos";
}

export function PreviewProvider({ children }: { children: ReactNode }) {
  const urlMode = useUrlMode();
  const [override, setOverride] = useState<PreviewMode | null>(null);
  const mode = override ?? urlMode;

  return (
    <PreviewContext.Provider value={mode}>
      {children}
      <PreviewToggle mode={mode} onChange={setOverride} />
    </PreviewContext.Provider>
  );
}

function PreviewToggle({
  mode,
  onChange,
}: {
  mode: PreviewMode;
  onChange: (next: PreviewMode) => void;
}) {
  return (
    <div className="preview-toggle" role="group" aria-label="Preview design">
      <span className="preview-toggle-label">Preview</span>
      <div className="preview-toggle-group">
        <button
          type="button"
          className={mode === "photos" ? "is-active" : ""}
          aria-pressed={mode === "photos"}
          onClick={() => onChange("photos")}
        >
          With photos
        </button>
        <button
          type="button"
          className={mode === "text" ? "is-active" : ""}
          aria-pressed={mode === "text"}
          onClick={() => onChange("text")}
        >
          Text only
        </button>
      </div>
    </div>
  );
}
