export function getColor(i: number, total: number) {
  const hue = (i / total) * 360;

  return `hsl(${hue}, 55%, 62%)`;
}
