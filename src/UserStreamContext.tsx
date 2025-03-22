import { createContext } from "react";
import { UserStreamContextValues } from "./types";

export const UserStreamContext = createContext<UserStreamContextValues>({
    audioStream: null,
    videoStream: null,
    isMuted: true,
    videoEnabled: false,
    startAudio: () => null,
    startVideo: () => Promise.resolve(null),
    stopVideo: () => null,
    muteAudio: () => null,
    unmuteAudio: () => null,
});

