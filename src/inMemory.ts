import * as poseDetection from '@tensorflow-models/pose-detection';

export let VAR_GAME_POSE: poseDetection.Pose | null = null;
export const VAR_POSE_HISTORY: poseDetection.Pose[][] = [];
export let VAR_PLAYER_NAME: string | null = `${Math.random()}${Math.random()}${Math.random()}`;

export function updatePlayerName(name: string | null){
  VAR_PLAYER_NAME = name;
}

export function updatePose(newPose: poseDetection.Pose){
  VAR_GAME_POSE = newPose;
}

const HISTORY_LENGTH = 10;

export function updatePoseHistory(newPoses: poseDetection.Pose[]){
  VAR_POSE_HISTORY.push(newPoses);
  if (VAR_POSE_HISTORY.length > HISTORY_LENGTH) {
    VAR_POSE_HISTORY.shift();
  }
}
