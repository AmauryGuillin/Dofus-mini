export function getRandomInt(range: number) {
  return Math.floor(Math.random() * range);
}

export function getRandomIntMinMax(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomPosition() {
  const col = getRandomInt(7);
  const row = getRandomInt(7);

  return `${col}-${row}`;
}
