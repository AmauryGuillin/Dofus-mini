export function playAudio(source: string, volume: number) {
  const music = document.createElement("audio");
  music.src = source;
  music.autoplay = true;
  music.loop = false;
  music.volume = volume;
  document.body.appendChild(music);
}
