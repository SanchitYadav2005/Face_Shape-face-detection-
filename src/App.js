import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl');
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs', // Use 'mediapipe' if you want to use MediaPipe
        maxFaces: 1
      };
      const detector = await faceDetection.createDetector(model, detectorConfig);
      setDetector(detector);
    };
    loadModel();
  }, []);

  useEffect(() => {
    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch(err => {
          console.error('Error accessing webcam: ', err);
        });
    };

    if (detector) {
      startVideo();
    }
  }, []);

  const detectFaces = async () => {
    if (videoRef.current && detector) {
      const predictions = await detector.estimateFaces(videoRef.current);

      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (predictions.length > 0) {
        predictions.forEach(prediction => {
          const start = prediction.box.startPoint;
          const end = prediction.box.endPoint;
          const size = [end[0] - start[0], end[1] - start[1]];

          ctx.beginPath();
          ctx.rect(start[0], start[1], size[0], size[1]);
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'red';
          ctx.stroke();
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      detectFaces();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Face Detection with TensorFlow.js</h1>
      <video ref={videoRef} style={{ display: 'none' }} width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
}

export default App;
