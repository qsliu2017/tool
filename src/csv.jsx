import { CsvError, parse } from "csv-parse/browser/esm";
import { useCallback, useEffect, useState } from "preact/hooks";

export default function CsvSplit() {
  const [input, setInput] = useState('"a","b","c"\n"1\n10","2","3"');
  const [output, setOutput] = useState([]);
  const [hiddenCols, setHiddenCols] = useState({});
  const [hiddenRows, setHiddenRows] = useState({});
  const onFileInputChange = useCallback(
    (e) => {
      if (!e.target.files) return;
      Promise.all(Array.from(e.target.files).map((f) => f.text()))
        .then((texts) => texts.join("\n"))
        .then(setInput);
    },
    [setInput],
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
      <input type="file" onChange={onFileInputChange} multiple />
      <textarea
        value={input}
        onInput={(e) => setInput(e.target.value)}
        style={{
          width: "99%",
          height: "400px",
          resize: "vertical",
        }}
      />
      {output instanceof CsvError ? (
        <div>
          {output.code} {output.message}
        </div>
      ) : (
        <table style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <th>#</th>
              {output &&
                output[0] &&
                output[0].map((_, i) => (
                  <th>
                    <input
                      type="checkbox"
                      value={!!hiddenCols[i]}
                      onChange={() =>
                        setHiddenCols({ ...hiddenCols, [i]: !hiddenCols[i] })
                      }
                    />
                    {hiddenCols[i] || i}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {output.map((row, i) => (
              <tr>
                <th>
                  <th>
                    <input
                      type="checkbox"
                      value={!!hiddenRows[i]}
                      onChange={() =>
                        setHiddenRows({ ...hiddenRows, [i]: !hiddenRows[i] })
                      }
                    />
                    {hiddenRows[i] || i}
                  </th>
                </th>
                {row.map((cell, j) => (
                  <td>
                    {hiddenRows[i] || hiddenCols[j] || JSON.stringify(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
