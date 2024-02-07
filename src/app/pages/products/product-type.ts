export interface Product extends ProductInput {
  id: number;
}

export interface ProductInput {
  name: string;
  description: string | null;
  price: number;
  fkCategoryId: number;
  imagePath: string | null;
  weight: number | null;
  discount: number | null;
}
