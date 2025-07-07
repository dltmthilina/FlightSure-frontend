export function calculateDuration(departure: string, arrival: string): number {
  const dep = new Date(departure);
  const arr = new Date(arrival);
  const diffMs = arr.getTime() - dep.getTime();
  return Math.max(Math.round(diffMs / 60000), 0); // duration in minutes, never negative
}


export function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}