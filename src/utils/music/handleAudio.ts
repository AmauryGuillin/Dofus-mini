import { getRandomInt } from "../tools/randomGenerators";

export function playAudio(
  source: string,
  volume: number,
  loop: boolean = false,
  removeAfter: boolean = false
) {
  const music = document.createElement("audio");
  music.src = source;
  music.autoplay = true;
  music.loop = loop;
  music.volume = volume;
  document.body.appendChild(music);
  if (removeAfter) {
    setTimeout(() => {
      document.body.removeChild(music);
    }, 5000);
  }
}

export function playErrorSound(volume: number) {
  const music = document.createElement("audio");
  music.src = "./global/error/374_fx_532.mp3.mp3";
  music.autoplay = true;
  music.loop = false;
  music.volume = volume;
  document.body.appendChild(music);
  setTimeout(() => {
    document.body.removeChild(music);
  }, 5000);
}

export function playClickSounds(volume: number) {
  const click1 = "./global/spell/269_fx_627.mp3.mp3";
  const click3 = "./global/spell/270_fx_626.mp3.mp3";
  const click2 = "./global/spell/271_fx_625.mp3.mp3";
  const sounds = [click1, click2, click3];

  const music = document.createElement("audio");
  music.src = sounds[getRandomInt(sounds.length)];
  music.autoplay = true;
  music.loop = false;
  music.volume = volume;
  document.body.appendChild(music);
  setTimeout(() => {
    document.body.removeChild(music);
  }, 2000);
}
