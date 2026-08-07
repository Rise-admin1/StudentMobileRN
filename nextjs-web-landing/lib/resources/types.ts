export type InlinePart =
  | string
  | {
      type: 'link';
      href: string;
      text: string;
    };

export type ResourceBlock =
  | {
      type: 'paragraph';
      parts: InlinePart[];
    }
  | {
      type: 'bullets';
      items: string[];
    };

export type ResourceSection = {
  id: string;
  title: string;
  blocks: ResourceBlock[];
};

export type ResourceArticle = {
  slug: string;
  category: 'Exam Preparation';
  categoryPath: '/exam-preparation';
  title: string;
  description: string;
  primaryKeywords: string[];
  secondaryKeywords?: string[];
  publishedAt: string;
  updatedAt?: string;
  intro: InlinePart[][];
  sections: ResourceSection[];
  closing: InlinePart[][];
};
