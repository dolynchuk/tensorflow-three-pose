import { useState, useRef, ReactNode } from "react";
import { UserStreamContext } from "./UserStreamContext";


type Props = {
  children: ReactNode
}
export const UserStreamProvider = ({ children }: Props) => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  const videoTrackRef = useRef<MediaStreamTrack>(null);

  const startAudio = async () => {
    try {
      if (!audioStream) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const muteAudio = () => {
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
      setIsAudioMuted(true);
    }
   
  };


  const unmuteAudio = async () => {
    let stream = audioStream;
    if (!stream){
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
    }
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
      setIsAudioMuted(false);
    }
  };

  // Start the video stream and store it
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      videoTrackRef.current = stream.getVideoTracks()[0];
      setIsVideoEnabled(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Stop the video stream and clear the state
  const stopVideo = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
      setIsVideoEnabled(false);
    }
  };

  return (
    <UserStreamContext.Provider
      value={{
        audioStream,
        videoEnabled: isVideoEnabled,
        videoStream,
        isMuted: isAudioMuted,
        startAudio,
        muteAudio,
        unmuteAudio,
        startVideo,
        stopVideo,
      }}
    >
      {children}
    </UserStreamContext.Provider>
  );
};
