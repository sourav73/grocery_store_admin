export interface Category {
  id: number;
  categoryName: string;
  parentId: number;
  subCategories: Category[];
}

export interface CategoryItem {
  id: number,
  parentId: number;
  categoryName: string,
  level: number
}