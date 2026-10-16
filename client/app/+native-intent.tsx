import { parseTeacherIdFromUrl } from './utils/teacherProfilePath';
import { parseSubjectIdFromUrl } from './utils/subjectShare';

export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  const subjectId = parseSubjectIdFromUrl(path);
  if (subjectId) {
    return `/course/${subjectId}`;
  }
  const teacherId = parseTeacherIdFromUrl(path);
  if (teacherId) {
    return `/teacher/${teacherId}`;
  }
  return path;
}
