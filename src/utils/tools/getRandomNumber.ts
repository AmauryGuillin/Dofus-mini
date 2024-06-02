export function getRandomInt(range: number) {
  return Math.floor(Math.random() * range);
}

export function getRandomIntMinMax(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
