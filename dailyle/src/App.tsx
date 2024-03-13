import React, { useRef, useState } from "react";
import "./App.css";
import Button from "./Button.tsx";

function App() {
  const iFrame = useRef<HTMLIFrameElement>(null);
  const [text, setText] = useState("");

  const handleClick = () => {
    var divElement = iFrame.current
      ? iFrame.current.querySelector("text-green-600")
      : null;
    if (divElement !== null) {
      if (divElement.textContent !== null) {
        setText(divElement.textContent);
      }
    } else {
      if (iFrame === null) {
        setText("iFrame null");
      } else {
        setText("Element not found");
      }
    }
  };

  return (
    <div className="App">
      <body>
        <h1>Dailyle</h1>
        <Button></Button>
        <p>{text}</p>
        <iframe
          ref={iFrame}
          className="iFrame"
          id="iFrame"
          src="https://worldle.teuteuf.fr/"
          title="Embedded Website"
        ></iframe>
        <button className="button" onClick={handleClick}>
          Update Text
        </button>
      </body>
    </div>
  );
}

export default App;
