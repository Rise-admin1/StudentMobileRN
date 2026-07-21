export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | {
      type: 'table';
      headers: [string, string, string];
      rows: [string, string, string][];
    };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
  subsections?: {
    id: string;
    title: string;
    blocks: LegalBlock[];
  }[];
};
