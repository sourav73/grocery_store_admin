export interface Category {
  id: number;
  categoryName: string;
  parentId: number;
  subCategories: Category[];
}
