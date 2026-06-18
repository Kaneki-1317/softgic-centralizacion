export function formatDate(date) {
  if (!date) return "";

  return new Date(date)
    .toLocaleDateString(
      "es-CO",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
}