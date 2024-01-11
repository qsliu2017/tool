import { render } from "preact";
import { useState } from "preact/hooks";

render(<App />, document.getElementById("app"));

function App() {
  return (
    <>
      <StringToUtf8CodePoint />
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
          <th>Character</th>
          <th>UTF-16 Code Point</th>
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
