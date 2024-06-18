import { useRef, useEffect } from "react";
import "./App.css";
import Webcam from "react-webcam";
import * as faceDetection from "@tensorflow-models/face-detection";
import "@tensorflow/tfjs-backend-webgl";

const App = () => {
  const webcamRef = useRef(null);

  const handleFaceDetection = async () => {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig = {
      runtime: "mediapipe",
    };
    const detector = await faceDetection.createDetector(model, detectorConfig);

    // Ensure that the video element is available
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const faces = await detector.estimateFaces(video);

      console.log(faces); // Log the detected faces for debugging
    } else {
      console.error('Video not ready');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleFaceDetection();
    }, 1000); // Run detection every second

    return () => clearInterval(interval);
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
