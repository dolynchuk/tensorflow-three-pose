import { Keypoint, } from "@tensorflow-models/pose-detection";
import { VAR_POSE_HISTORY } from "../inMemory";

export const VIDEO_CONFIG = {
  width: 640,
  height: 480,
};

const BODY_CONNECTIONS: [string, string][] = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_hip", "right_hip"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];

export function calculateAngle(p1: Keypoint, p2: Keypoint) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(-dy, dx);
}

export async function flipVideo(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
  try {
    const ctx = canvasElement.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    function drawFlippedFrame() {
      if (!ctx) throw new Error("Canvas context not available");
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(videoElement, -canvasElement.width, 0);
      ctx.restore();
      requestAnimationFrame(drawFlippedFrame);
    }

    drawFlippedFrame();
    return canvasElement.captureStream(30);
  } catch (error) {
    console.error("Error flipping video:", error);
    throw error;
  }
}

export function drawKeypoints(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  keypoints.forEach((keypoint) => {
    if (keypoint.score && keypoint.score >= minConfidence) {
      const flippedX = VIDEO_CONFIG.width - keypoint.x * scale; // Flip x-axis
      const y = keypoint.y * scale;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "40px Arial"; 

      ctx.save();
      ctx.beginPath();
      ctx.arc(flippedX, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.restore();
    }
  });
}

export function drawSkeleton(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  BODY_CONNECTIONS.forEach(([partA, partB]) => {
    const kp1 = keypoints.find((kp) => kp.name === partA);
    const kp2 = keypoints.find((kp) => kp.name === partB);

    if (kp1 && kp1.score && kp2 && kp2.score && kp1.score >= minConfidence && kp2.score >= minConfidence) {
      const x1 = VIDEO_CONFIG.width - kp1.x * scale; // Flip x-axis
      const y1 = kp1.y * scale;
      const x2 = VIDEO_CONFIG.width - kp2.x * scale; // Flip x-axis
      const y2 = kp2.y * scale;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.stroke();
    }
  });
}

export function drawPoses(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
  if (!canvas || !video || video.videoWidth === 0 || video.videoHeight === 0) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(video, -VIDEO_CONFIG.width, 0, VIDEO_CONFIG.width, VIDEO_CONFIG.height);
  ctx.restore();

  const smoothedPoses = computeSmoothedPoses();
  smoothedPoses.forEach((pose) => {
    drawKeypoints(pose.keypoints, 0.5, ctx);
    drawSkeleton(pose.keypoints, 0.5, ctx);
  });
}

function computeSmoothedPoses() {
  if (!VAR_POSE_HISTORY.length) return [];
  const latestPoses = VAR_POSE_HISTORY[VAR_POSE_HISTORY.length - 1];

  return latestPoses.map((pose) => {
    const smoothedKeypoints = pose.keypoints.map((keypoint, i) => {
      const positions = VAR_POSE_HISTORY.map((poses) => poses[i]?.keypoints[i] || keypoint);
      const avgX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
      const avgY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;
      return { ...keypoint, x: avgX, y: avgY };
    });
    return { ...pose, keypoints: smoothedKeypoints };
  });
}
