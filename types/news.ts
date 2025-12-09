export interface NewsItem {
  content_id: string;
  title: string;
  subtitle?: string;
  content?: string;
  full_content?: string;
  created_at: string;
  category?: string;
  category_name?: string;
  image_url?: string;
  author?: string;
  tags?: string[];
  views?: number;
  is_featured?: boolean;
}

export interface NewsApiResponse {
  status: boolean;
  message: string;
  data: {
    total: number;
    current_page: number;
    total_pages: number;
    data: NewsItem[];
  };
}

export interface NewsDetailsApiResponse {
  status: boolean;
  message: string;
  data: NewsItem;
}