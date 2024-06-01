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
