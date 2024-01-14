import { render } from "preact";
import { lazy, Suspense } from "preact/compat";
import { useState } from "preact/hooks";

const CsvSplit = lazy(() => import("./csv"));
const StringToUtf8CodePoint = lazy(() => import("./utf"));

const layouts = ["utf", "csv"];

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
        ) : (
          <div>Unknown</div>
        )}
      </Suspense>
    </>
  );
}
