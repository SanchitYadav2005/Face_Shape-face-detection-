import { useRef, useEffect } from "react";
import "./App.css";
import Webcam from "react-webcam";
import * as faceDetection from "@tensorflow-models/face-detection";
import "@tensorflow/tfjs-backend-webgl";

const App = () => {
  const webcamRef = useRef(null);

  const handleDetection = async () => {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig = {
      runtime: "mediapipe",
    };

    const detector = await faceDetection.createDetector(model, detectorConfig);
    console.log(detector);

    const detectFaces = async () => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const faces = await detector.estimateFaces(video);
        console.log(faces);
      }
    };

    setInterval(detectFaces, 1000); // Detect faces every second
  };

  useEffect(() => {
    handleDetection();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="title">Face Shape</div>
      </header>
      <Webcam
        audio={false}
        ref={webcamRef}
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
};

export default App;
