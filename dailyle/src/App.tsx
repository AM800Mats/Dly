import React, { useRef, useState } from "react";
import "./App.css";
import Button from "./Button.tsx";

function App() {
  const iFrame = useRef<HTMLIFrameElement>(null);
  const [text, setText] = useState("");

  const [selectedGame, setSelectedGame] = useState("Worldle");
  const [gameUrl, setGameUrl] = useState("https://worldle.teuteuf.fr/");

  /**
   * Handles the click event and fetches data from the server.
   */
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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGame(event.target.value);
    switch (event.target.value) {
      case "Worldle":
        setGameUrl("https://worldle.teuteuf.fr/");
        break;
      case "Costcodle":
        setGameUrl("https://costcodle.com/");
        break;
      case "Tradle":
        setGameUrl("https://games.oec.world/en/tradle/");
        break;
      case "NYT Wordle":
        setGameUrl("https://www.nytimes.com/games/wordle/index.html");
        break;
      case "Flagle":
        setGameUrl("https://flagle-game.com/");
        break;
      case "Foodguessr":
        setGameUrl("https://foodguessr.com/");
        break;
      case "Unzoomed":
        setGameUrl("https://unzoomed.com/");
        break;
      default:
        setGameUrl("https://worldle.teuteuf.fr/");
    }
  };

  return (
    <div className="App">
      <body className="background">
        <h1>Dailyle</h1>
        <Button></Button>
        <p>{text}</p>
        <iframe
          ref={iFrame}
          className="iFrame"
          id="iFrame"
          src={gameUrl}
          title="Embedded Website"
        ></iframe>
        <div className='optionsField'>
          <button className="button" onClick={handleClick}>
            Update Text
          </button>
          <select value={selectedGame} onChange={handleSelectChange}>
            <option value="Worldle">Worldle</option>
            <option value="Costcodle">Costcodle</option>
            <option value="Tradle">Tradle</option>
            <option value="NYT Wordle">NYT Wordle</option>
            <option value="Flagle">Flagle</option>
            <option value="Foodguessr">Foodguessr</option>
            <option value="Unzoomed">Unzoomed</option>
          </select>
        </div>
        <Test />
      </body>
    </div>
  );
}

export default App;
