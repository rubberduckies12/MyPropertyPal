//backend handlers done here
function daysLeft(dateStr) {
  const now = new Date();
  const end = new Date(dateStr);
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}