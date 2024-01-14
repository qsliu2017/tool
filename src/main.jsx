import { CsvError, parse } from "csv-parse/browser/esm";
import { render } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

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

function StringToUtf8CodePoint() {
  const [input, setInput] = useState("English(us)\n中文(简体）　\n🤣");
  return (
    <div>
      <textarea
        value={input}
        onInput={(e) => setInput(e.target.value)}
        style={{
          width: "99%",
          height: "400px",
          resize: "vertical",
        }}
      />
      <table>
        <thead>
          <tr>
            <th>Character</th>
            <th>UTF-16 Code Point</th>
          </tr>
        </thead>
        <tbody>
          {[...input].map((char) => {
            const codePoint = char.codePointAt(0).toString(16).padStart(4, "0");
            return (
              <tr>
                <th>
                  <a
                    href={`https://www.compart.com/en/unicode/U+${codePoint}`}
                    target="_blank"
                  >
                    {"'" + char + "'"}
                  </a>
                </th>
                <th>\u{codePoint}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CsvSplit() {
  const [input, setInput] = useState('"a","b","c"\n"1\n10","2","3"');
  const [output, setOutput] = useState([]);
  const onFileInputChange = useCallback(
    (e) => {
      if (!e.target.files) return;
      Promise.all(Array.from(e.target.files).map((f) => f.text()))
        .then((texts) => texts.join("\n"))
        .then(setInput);
    },
    [setInput]
  );
  useEffect(() => {
    let shouldUpdate = true;
    parse(input, {}, (err, output) => {
      if (!shouldUpdate) return;
      console.debug({ input, output, err });
      if (err) {
        setOutput(err);
        return;
      }
      setOutput(output);
    });
    return () => {
      shouldUpdate = false;
    };
  }, [input]);
  return (
    <div>
      <textarea
        value={input}
        onInput={(e) => setInput(e.target.value)}
        style={{
          width: "99%",
          height: "400px",
          resize: "vertical",
        }}
      />
      <input type="file" onChange={onFileInputChange} multiple />
      {output instanceof CsvError ? (
        <div>
          {output.code} {output.message}
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              {[
                ...Array(
                  output
                    .map((row) => row.length)
                    .reduce((a, b) => Math.max(a, b), 0)
                ).keys(),
              ].map((_, i) => (
                <td>{i}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.map((row) => (
              <tr>
                {row.map((cell) => (
                  <td>{JSON.stringify(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
