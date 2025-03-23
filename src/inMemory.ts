import * as poseDetection from '@tensorflow-models/pose-detection';

export let VAR_GAME_POSE: poseDetection.Pose | null = null;
export let VAR_PLAYER_NAME: string | null = `${Math.random()}${Math.random()}${Math.random()}`;

export function updatePlayerName(name: string | null){
  VAR_PLAYER_NAME = name;
}

export function updatePose(newPose: poseDetection.Pose){
  VAR_GAME_POSE = newPose;
}
