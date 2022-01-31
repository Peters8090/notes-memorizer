import path from "path";
import React, { Component, useEffect, useState } from "react";
import * as Tone from "tone";
import "./App.css";

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

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const App = () => {
  const [allowedNotes, setAllowedNotes] = useState("");
  const [lastNotes, setLastNotes] = useState("");
  const [answer, setAnswer] = useState("");

  const playNote = (note: string | string[], duration = 1) => {
    Tone.loaded().then(() => {
      sampler.triggerAttackRelease(note, duration);
    });
  };

  const getRandomSounds = (length = 3) => {
    const randomSounds = notes.filter((n) => {
      const note = n[0];
      const isFlat = n[1] === "b";
      const octave = +(n[1] === "b" ? n[2] : n[1]);

      return !isFlat && octave === 4 && allowedNotes.split(",").includes(note);
    });
    shuffle(randomSounds);
    randomSounds.length = Math.min(allowedNotes.split(",").length, 3);

    return randomSounds;
  };

  const playPuzzleMelody = (sounds = getRandomSounds()) => {
    const duration = 1;

    for (let i = 0; i < sounds.length; i++) {
      setTimeout(() => {
        playNote(sounds[i], duration);
      }, duration * i * 1000);
    }
    setLastNotes(sounds.join(","));

    console.log(duration * sounds.length * 1000);
  };

  const playRepeat = () => {
    if (lastNotes) {
      playPuzzleMelody(lastNotes.split(","));
    }
  };

  return (
    <div className="App">
      <h1>Relative Pitch Helper</h1>
      <h3>Separate notes with a comma, no spaces</h3>
      <input
        value={allowedNotes}
        onChange={(e) => setAllowedNotes(e.target.value.toUpperCase())}
        placeholder="Available notes"
      />
      <button disabled={!allowedNotes} onClick={() => playPuzzleMelody()}>
        Puzzle Melody
      </button>
      <button disabled={!lastNotes} onClick={playRepeat}>
        Repeat
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const lastNotesTolerant = lastNotes
            .split("")
            .filter((l) => isNaN(+l))
            .join("");

          if (lastNotesTolerant === answer) {
            alert("Good: " + lastNotesTolerant);
          } else {
            alert("Bad: " + lastNotesTolerant);
          }

          setAnswer("");
        }}
      >
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value.toUpperCase())}
          placeholder="Your guess"
        />
        <button type="submit" disabled={!lastNotes}>
          Check
        </button>
      </form>
    </div>
  );
};
