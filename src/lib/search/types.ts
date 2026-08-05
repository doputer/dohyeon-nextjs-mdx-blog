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
  chosung: string;
}

export interface PreparedDocument {
  document: SearchDocument;
  fields: SearchField[];
}

export interface SearchResult {
  document: SearchDocument;
  score: number;
}
