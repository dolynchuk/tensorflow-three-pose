import { useContext, useRef, useEffect, useCallback } from "react";
import { UserStreamContext } from "../UserStreamContext";
import './styles.css';

const SPECTRUM_CONFIG = {
  width: 600,
  height: 200,
  fftSize: 2048, // Must be power of 2
  smoothing: 0.1,
};

export const Spectrum = () => {
  const {
    isMuted,
    audioStream,
  } = useContext(UserStreamContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const drawSpectrum = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    const bufferLength = analyserRef.current.frequencyBinCount / 4;
    const dataArray = new Uint8Array(bufferLength);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (isMuted) {
      // Draw flat line at 0 when muted
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    } else {
      // Get frequency data and draw spectrum
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        
        ctx.fillStyle = `white`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    animationFrameIdRef.current = requestAnimationFrame(drawSpectrum);
  }, [isMuted]);

  // Setup audio analysis
  useEffect(() => {
    if (!audioStream || !canvasRef.current) return;

    // Create audio context and analyser
    audioContextRef.current = new (window.AudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    
    analyserRef.current.fftSize = SPECTRUM_CONFIG.fftSize;
    analyserRef.current.smoothingTimeConstant = SPECTRUM_CONFIG.smoothing;

    // Connect audio stream
    sourceRef.current = audioContextRef.current.createMediaStreamSource(audioStream);
    sourceRef.current.connect(analyserRef.current);
    // Start visualization
    drawSpectrum();

    return () => {
      // Cleanup
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioStream, drawSpectrum]);
  
  return (
    <div className="spectrum">
        {
            isMuted ? <h1>muted</h1> : <canvas
            className="spectrumCanvas"
              ref={canvasRef}
              style={{ background: "black" }}
            />
        }
      
    </div>
  );
};
