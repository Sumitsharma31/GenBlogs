export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: {
    url: string;
    alt: string;
    credit?: string;
  };
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  status: 'draft' | 'published';
  topic: string;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
