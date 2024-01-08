export function formatDate(date) {
  const dateObj = new Date(date);
  const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const year = dateObj.toLocaleDateString('en-US', { year: 'numeric' });
  const hour = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

  return `${day} ${month} ${year}, ${hour}`;
}
