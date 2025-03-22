import { useContext, useRef, useEffect, useCallback, useState } from "react";
import { UserStreamContext } from "../UserStreamContext";
import "./styles.css";
import { updatePoseHistory, updatePose } from "../inMemory";
import { drawPoses, VIDEO_CONFIG } from "./utils";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from '@tensorflow-models/pose-detection';

const base = '/tensorflow-three-pose/';

export const UserVideo = () => {

  const {
    videoStream,
    stopVideo,
    startVideo,
    startAudio,
    isMuted,
    // muteAudio,
    // unmuteAudio,
    videoEnabled,
  } = useContext(UserStreamContext);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const detectorRef = useRef<poseDetection.PoseDetector>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadDetector() {
      await tf.ready();
      await tf.setBackend("webgl");
      detectorRef.current = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
        runtime: 'tfjs',
        enableSmoothing: true,
      });
      setIsLoading(false);
    }
    setIsLoading(true);
    loadDetector();
  }, []);

  const detectPoses = useCallback(async () => {
    if (!videoRef.current || !detectorRef.current || !canvasRef.current) return;
    const poses = await detectorRef.current.estimatePoses(videoRef.current);

    if (poses[0]){
      updatePose(poses[0]);
      updatePoseHistory(poses);
    }

    drawPoses(canvasRef.current, videoRef.current);
    animationFrameIdRef.current = requestAnimationFrame(detectPoses);
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;
    const video = videoRef.current;

    const handleVideoLoad = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0 || !canvasRef.current) return;
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
      if (videoEnabled) detectPoses();
    };

    video.srcObject = videoStream;
    video.onloadedmetadata = handleVideoLoad;
    video.onerror = () => console.error("Video loading error");
    if (videoEnabled) video.play().catch(err => console.warn("Video play error:", err));

    const canvas = canvasRef.current;
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    
      if (!canvas){
        return;
      }
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [videoStream, detectPoses, videoEnabled]);

  const handleVideoToggle = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (videoStream) {
      stopVideo();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    } else {
      startVideo();
      startAudio();
    }
  };

  useEffect(() => {
    if (!videoEnabled && canvasRef.current) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [videoEnabled]);

  return (
    <div className="userVideo">
      <video ref={videoRef} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} muted={isMuted} className="videoHidden" autoPlay />
      <canvas className="videoCanvas" ref={canvasRef} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height} />
      <div className="userVideoControls">
        <button className={`controlsButton ${isLoading ? 'loading' : ''}`} onClick={handleVideoToggle} disabled={isLoading}>
          {isLoading ? <img src={`${base}loading.svg`}/> :  videoEnabled ? <img src={`${base}video-on.svg`} /> : <img src={`${base}video-off.svg`} />}
        </button>
        {/* <button disabled={isLoading} className={`controlsButton ${isLoading ? 'loading' : ''}`} onClick={() => isMuted ? unmuteAudio() : muteAudio()}>
          {isMuted ? <img src="/audio-off.svg" /> : <img src="/audio-on.svg" />}
        </button> */}
      </div>
    </div>
  );
};
