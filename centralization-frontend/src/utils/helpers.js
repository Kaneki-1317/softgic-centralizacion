export function truncateText(
  text,
  length = 120
) {
  if (!text) return "";

  return text.length > length
    ? text.substring(0, length) + "..."
    : text;
}

export function uniqueValues(
  array
) {
  return [...new Set(array)];
}