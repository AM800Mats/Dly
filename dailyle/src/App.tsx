import React, { useRef, useState } from "react";
import "./App.css";
import Test from "./test.tsx";

function App() {
  const iFrame = useRef<HTMLIFrameElement>(null);
  const [text, setText] = useState("");

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/scrape');
      const text = await response.text();
      setText('Text: ' + text);
    } catch (error) {
      console.error('Error:', error);
      setText('Error occurred while fetching data');
    }
  };

  return (
    <div className="App">
      <body>
        <h1>Dailyle</h1>
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
        <Test />
      </body>
    </div>
  );
}

export default App;
