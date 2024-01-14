import { useState } from "preact/hooks";
export default function StringToUtf8CodePoint() {
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
      <table style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Character</th>
            <th>UTF-16 Code Point</th>
          </tr>
        </thead>
        <tbody>
          {[...input].map((char, i) => {
            const codePoint = char.codePointAt(0).toString(16).padStart(4, "0");
            return (
              <tr>
                <th>{i}</th>
                <td>
                  <a
                    href={`https://www.compart.com/en/unicode/U+${codePoint}`}
                    target="_blank"
                  >
                    {"'" + char + "'"}
                  </a>
                </td>
                <td>\u{codePoint}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
