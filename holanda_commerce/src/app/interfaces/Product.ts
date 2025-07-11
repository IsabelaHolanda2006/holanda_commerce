export type Product = {
  id: string;
  name: string;
  price: number;
  fabrication_date?: string;
  expiration_date?: string;
  stock: number;
  discount_percentage: number;
  description?: string;
  image_url: string | null;
  category_id: string;
  category_name?: string;
  is_wishlist?: boolean;
};