"use client";

import { useCallback, useImperativeHandle, useRef, useState, type Ref } from "react";

export type MusicControl = { play: () => void };

export function InvitationMusic({ controlRef }: { controlRef: Ref<MusicControl> }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }
    play();
  }

  useImperativeHandle(controlRef, () => ({ play }), [play]);

  return (
    <>
      <audio ref={audioRef} src="/music/fall-in-love.mp3" loop preload="auto" />
      <button
        type="button"
        className="music-toggle no-print"
        aria-pressed={playing}
        aria-label={playing ? "Pause music" : "Play music"}
        onClick={toggle}
      >
        <MusicIcon />
      </button>
    </>
  );
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 17.5a2.5 2.5 0 1 1-2-2.45V6.2l10-2v9.35" />
      <path d="M17 15.5a2.5 2.5 0 1 1-2-2.45" />
    </svg>
  );
}
