import path from "path";
import React, { Component, useEffect } from "react";
import * as Tone from "tone";

import { notes } from "./notes";

const sampler = new Tone.Sampler({
  urls: {
    C4: "C4.mp3",
    "D#4": "Ds4.mp3",
    "F#4": "Fs4.mp3",
    A4: "A4.mp3",
  },
  release: 1,
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

export const App = () => {
  const playNote = (note: string) => {
    Tone.loaded().then(() => {
      sampler.triggerAttackRelease(note, 1);
    });
  };

  return (
    <div>
      {notes.map((n) => (
        <button key={n} onClick={() => playNote(n)}>
          {n}
        </button>
      ))}
    </div>
  );
};
