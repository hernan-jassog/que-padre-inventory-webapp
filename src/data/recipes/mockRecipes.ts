import type { Recipe } from '../../core/entities/Recipe';

// Mapped to mockProducts IDs:
// p1: Totopos (kg)
// p2: Queso Cotija (kg)
// p3: Crema (L)
// p4: Salsa Verde (L)
// p5: Salsa Roja (L)
// p6: Pollo Deshebrado (kg)
// p7: Huevo (pzas)

export const mockRecipes: Recipe[] = [
  {
    id: 'r1',
    dishName: 'Chilaquiles Verdes',
    ingredients: [
      { productId: 'p1', quantityRequired: 0.2 },   // 200g
      { productId: 'p4', quantityRequired: 0.15 },  // 150ml
      { productId: 'p3', quantityRequired: 0.05 },  // 50ml
      { productId: 'p2', quantityRequired: 0.05 },  // 50g
    ]
  },
  {
    id: 'r2',
    dishName: 'Chilaquiles Rojos con Pollo',
    ingredients: [
      { productId: 'p1', quantityRequired: 0.2 },
      { productId: 'p5', quantityRequired: 0.15 },
      { productId: 'p3', quantityRequired: 0.05 },
      { productId: 'p2', quantityRequired: 0.05 },
      { productId: 'p6', quantityRequired: 0.1 },   // 100g de pollo
    ]
  },
  {
    id: 'r3',
    dishName: 'Extra Huevo',
    ingredients: [
      { productId: 'p7', quantityRequired: 1 },     // 1 pieza
    ]
  }
];
