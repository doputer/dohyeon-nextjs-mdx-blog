export interface SearchDocument {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  headings: string[];
  body: string;
}

interface SearchField {
  weight: number;
  lower: string;
  /** 자모만으로 이루어진 질의의 초성 매칭을 받아줄 필드인지. */
  allowsChosung: boolean;
}

export interface PreparedDocument {
  document: SearchDocument;
  fields: SearchField[];
}

export interface SearchResult {
  document: SearchDocument;
  score: number;
}
