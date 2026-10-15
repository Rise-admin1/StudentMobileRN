export function formatPresence({ online, lastSeenAt } = {}) {
  if (online) return 'Online';
  if (!lastSeenAt) return null;

  const seen = new Date(lastSeenAt);
  if (Number.isNaN(seen.getTime())) return null;

  const now = new Date();
  const diffMs = now.getTime() - seen.getTime();
  if (diffMs < 60 * 1000) return 'Last seen just now';

  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 60) {
    return minutes === 1
      ? 'Last seen 1 minute ago'
      : `Last seen ${minutes} minutes ago`;
  }

  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 24) {
    return hours === 1
      ? 'Last seen 1 hour ago'
      : `Last seen ${hours} hours ago`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (seen.toDateString() === yesterday.toDateString()) {
    return 'Last seen yesterday';
  }

  const sameYear = seen.getFullYear() === now.getFullYear();
  const dateLabel = seen.toLocaleDateString([], sameYear
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' });
  return `Last seen ${dateLabel}`;
}
