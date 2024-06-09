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
