export interface Product {
  id: string;
  sku: string;
  name: Record<string, string>; // i18n names { pt, fr, de, it }
  description: Record<string, string>;
  shortDescription: Record<string, string>;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  stock: number;
  category: string;
  subCategory?: string;
  images: string[];
  mainImage: string;
  ratings: {
    average: number;
    count: number;
  };
  attributes: Record<string, any>;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isNew?: boolean;
  isPromo?: boolean;
  updatedAt: string;
  createdAt: string;
}


