export const SUBJECT_SHARE_ORIGIN = 'https://www.coachacadem.ae';

const COURSE_PATH_RE = /(?:^|\/)course\/([^/?#]+)/;

export function getSubjectShareUrl(subjectId: string) {
  return `${SUBJECT_SHARE_ORIGIN}/course/${subjectId}`;
}

export function parseSubjectIdFromUrl(input?: string | null): string | null {
  if (!input) return null;

  try {
    if (input.includes('://')) {
      const url = new URL(input);
      if (url.hostname === 'course') {
        const id = url.pathname.replace(/^\//, '').split('/')[0];
        return id || null;
      }
      const fromPath = url.pathname.match(COURSE_PATH_RE);
      if (fromPath?.[1]) return decodeURIComponent(fromPath[1]);
    }
  } catch {
    // Fall through to regex on the raw string.
  }

  const match = input.match(COURSE_PATH_RE);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}
