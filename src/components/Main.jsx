import { useCallback, useRef } from "react";
import "../styles/webcam.css";
import Webcam from "react-webcam";

const videoContraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const Main = () => {
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imgSrc = webcamRef.current.getScreenshot();
    console.log(imgSrc)
  }, [webcamRef]);
  return (
    <>
      <div className="webcam-container">
        <Webcam
          audio={false}
          imageSmoothing={true}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoContraints}
          className="web-cam"
        />
        <button onClick={capture}>Take a shot</button>
      </div>
      
    </>
  );
};

export default Main;
