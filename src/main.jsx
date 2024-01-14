import { render } from "preact";
import { useState } from "preact/hooks";
import CsvSplit from "./csv";
import StringToUtf8CodePoint from "./utf";

const layouts = new Map([
  ["utf", (key) => <StringToUtf8CodePoint key={key} />],
  ["csv", (key) => <CsvSplit key={key} />],
]);

render(<App />, document.getElementById("app"));

function App() {
  const [layout, setLayout] = useState(layouts.keys().next()?.value);
  return (
    <>
      <select value={layout} onChange={(e) => setLayout(e.target.value)}>
        {Array.from(layouts.keys()).map((key) => (
          <option value={key}>{key}</option>
        ))}
      </select>
      {layouts.get(layout)(layout)}
    </>
  );
}
