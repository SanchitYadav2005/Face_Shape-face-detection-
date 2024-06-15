import { useCallback, useRef, useState, useEffect } from "react";
import "../styles/webcam.css";
import Webcam from "react-webcam";
import * as faceDetection from "@tensorflow-models/face-detection";
import "@tensorflow/tfjs-backend-webgl";

// defining the constraints for the photo
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const Main = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [detections, setDetections] = useState(null);
  const [detector, setDetector] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'mediapipe', // or 'tfjs'
      };
      const loadedDetector = await faceDetection.createDetector(model, detectorConfig);
      setDetector(loadedDetector);
    };
    loadModel();
  }, []);

  const capture = useCallback(() => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImageSrc(imgSrc);
    if (imgSrc) {
      handleDetection(imgSrc);
    }
  }, [webcamRef, detector]);

  const handleDetection = async (imageSrc) => {
    if (!detector) return;

    const img = new Image();
    img.src = imageSrc;

    img.onload = async () => {
      const faces = await detector.estimateFaces(img);
      setDetections(faces);
    };
  };

  return (
    <>
      <div className="webcam-container">
        <Webcam
          audio={false}
          imageSmoothing={true}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="web-cam"
        />
        <button onClick={capture}>Take a shot</button>
      </div>
      {imageSrc && (
        <div className="screenshot-container">
          <img src={imageSrc} alt="screenshot" />
          {detections && detections.map((detection, index) => (
            <div
              key={index}
              className="bounding-box"
              style={{
                left: `${detection.boundingBox.topLeft[0]}px`,
                top: `${detection.boundingBox.topLeft[1]}px`,
                width: `${detection.boundingBox.bottomRight[0] - detection.boundingBox.topLeft[0]}px`,
                height: `${detection.boundingBox.bottomRight[1] - detection.boundingBox.topLeft[1]}px`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Main;
