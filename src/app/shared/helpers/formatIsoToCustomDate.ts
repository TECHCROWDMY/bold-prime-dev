export function formatIsoToCustomDate(
  isoDateString: string,
  customOffSet: number
): string {
  const date = new Date(isoDateString);

  // Adjust the time by subtracting 4 hours (for example)
  let targetOffset = customOffSet;
  const adjustedHours = (date.getHours() + targetOffset + 24) % 24;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(adjustedHours).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
