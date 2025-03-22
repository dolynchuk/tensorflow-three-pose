// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Pose } from "@tensorflow-models/posenet";

export type UserStreamContextValues = {
  audioStream: MediaStream | null;
  isMuted: boolean;
  startAudio: () => void;
  videoEnabled: boolean;
  videoStream: MediaStream | null;
  startVideo: () => Promise<unknown>;
  stopVideo: () => void;
  muteAudio: () => void;
  unmuteAudio: () => void;
};

export type Person = {
  id: string;
  name: string;
  audioStream: MediaStream | null;
  videoStream: MediaStream | null;
  videoEnabled: boolean;
  audioMuted: boolean;
  poses: Pose[];
};

export type ConferenceContextValues = {
  people: Person[];
};

