export interface RecipeIngredient {
  productId: string;
  quantityRequired: number; // in the product's unit
}

export interface Recipe {
  id: string;
  dishName: string;
  ingredients: RecipeIngredient[];
}
