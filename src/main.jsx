import { render } from "preact";
import { lazy, Suspense } from "preact/compat";
import { useState } from "preact/hooks";

const CsvSplit = lazy(() => import("./csv"));
const StringToUtf8CodePoint = lazy(() => import("./utf"));
const SpacingCJK = lazy(() => import("./spacing"));

const layouts = ["utf", "csv", "spacing"];

render(<App />, document.getElementById("app"));

function App() {
  const [layout, setLayout] = useState(layouts[0]);
  return (
    <>
      <select value={layout} onChange={(e) => setLayout(e.target.value)}>
        {layouts.map((key) => (
          <option value={key}>{key}</option>
        ))}
      </select>
      <Suspense fallback={<div>Loading...</div>}>
        {layout === "utf" ? (
          <StringToUtf8CodePoint key="utf" />
        ) : layout === "csv" ? (
          <CsvSplit key="csv" />
        ) : layout === "spacing" ? (
          <SpacingCJK key="spacing" />
        ) : (
          <div>Unknown</div>
        )}
      </Suspense>
    </>
  );
}
