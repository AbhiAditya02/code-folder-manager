export { cn } from "cn";

export function getYearString(year: number | string): string {
  const y = typeof year === 'string' ? parseInt(year) : year;
  switch (y) {
    case 1: return "1st";
    case 2: return "2nd";
    case 3: return "3rd";
    case 4: return "4th";
    default: return `${y}th`;
  }
}
