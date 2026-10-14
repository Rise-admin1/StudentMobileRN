export const COMMON_SUBJECT_OPTIONS = [
  'Mathematics',
  'English',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Accounting',
  'Business Studies',
  'History',
  'Geography',
  'Psychology',
  'Further Mathematics',
  'Statistics',
  'Environmental Science',
  'Combined Science',
  'Literature',
  'Arabic',
  'French',
  'Spanish',
  'Hindi',
  'Political Science',
  'Sociology',
  'Information Technology',
  'Art',
  'Music',
  'Physical Education',
  'Design and Technology',
  'Law',
  'Philosophy',
].map((label) => ({ label, value: label.toLowerCase() }));

export const normalizeSubjectOption = (value) => {
  const saved = String(value || '').trim().toLowerCase();
  return COMMON_SUBJECT_OPTIONS.some((option) => option.value === saved) ? saved : '';
};
