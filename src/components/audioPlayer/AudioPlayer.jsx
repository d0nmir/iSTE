
import wave from "../../assets/icons/wave.gif"
import pause from "../../assets/icons/pause.png"
import React, { useRef, useEffect, useState } from "react";
import lofi from "../../assets/sound/lofi.mp3";
import "./AudioPlayer.css";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true; 
      audioRef.current.play().catch(() => {
        setPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="music-player">
        <div className="container">
            <div className="audio_bg">
                <button className="play-btn" onClick={togglePlay}>
                {playing ? <img className="audio_state" src={wave} alt="" /> : <img className="audio_state" src={pause} alt="" />}
                </button>
                <audio ref={audioRef} src={lofi} />
            </div>
        </div>
    </div>
  );
}
