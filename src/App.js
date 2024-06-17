import { useRef } from "react";
import "./App.css";
import Webcam from "react-webcam";

const App = () => {
  const webcam = useRef(null);

  return (
    <div className="App">
      <header className="header">
        <div className="title">face mask App</div>
      </header>
      <Webcam
        audio={false}
        ref={webcam}
        style={{
          position: "absolute",
          margin: "auto",
          textAlign: "center",
          top: 100,
          left: 0,
          right: 0,
        }}
      />
    </div>
  );
}

export default App;