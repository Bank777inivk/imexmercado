export interface Category {
  id: string;
  slug: string;
  name: Record<string, string>;
  icon?: string;
  image?: string;
  parentId?: string;
  order: number;
}
