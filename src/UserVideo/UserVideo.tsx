import { useContext, useRef, useEffect, useCallback, useState } from "react";
import { UserStreamContext } from "../UserStreamContext";
import "./styles.css";
import { updatePose } from "../inMemory";
import { drawFlippedVideo, VIDEO_CONFIG } from "./utils";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { BASE } from "../constants";

export const UserVideo = () => {
  const {
    videoStream,
    stopVideo,
    startVideo,
    startAudio,
    isMuted,
    videoEnabled,
  } = useContext(UserStreamContext);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const poseAnimationFrameIdRef = useRef<number | null>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadDetector() {
      await tf.ready();
      await tf.setBackend("webgl");
      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        { runtime: "tfjs", enableSmoothing: true }
      );
      setIsLoading(false);
    }
    setIsLoading(true);
    loadDetector();
  }, []);

  const detectPoses = useCallback(async () => {
    if (!videoRef.current || !detectorRef.current) return;
    const poses = await detectorRef.current.estimatePoses(videoRef.current);

    if (poses[0]) {
      updatePose(poses[0]);
    }

    poseAnimationFrameIdRef.current = requestAnimationFrame(detectPoses);
  }, []);

  const renderFlippedVideo = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    drawFlippedVideo(canvasRef.current, videoRef.current);
    animationFrameIdRef.current = requestAnimationFrame(renderFlippedVideo);
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;

    const handleVideoLoad = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) return;
      if (canvasRef.current) {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
      }
      if (videoEnabled) {
        renderFlippedVideo();
        detectPoses();
      }
    };

    video.srcObject = videoStream;
    video.onloadedmetadata = handleVideoLoad;
    video.onerror = () => console.error("Video loading error");
    if (videoEnabled) {
      video.play().catch((err) => console.warn("Video play error:", err));
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (poseAnimationFrameIdRef.current) {
        cancelAnimationFrame(poseAnimationFrameIdRef.current);
        poseAnimationFrameIdRef.current = null;
      }
      canvasRef.current?.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };
  }, [videoStream, detectPoses, renderFlippedVideo, videoEnabled]);

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
        <button className={`controlsButton ${isLoading ? "loading" : ""}`} onClick={handleVideoToggle} disabled={isLoading}>
          {isLoading ? (
            <img src={`${BASE}loading.svg`} />
          ) : videoEnabled ? (
            <img src={`${BASE}video-on.svg`} />
          ) : (
            <img src={`${BASE}video-off.svg`} />
          )}
        </button>
      </div>
    </div>
  );
};
