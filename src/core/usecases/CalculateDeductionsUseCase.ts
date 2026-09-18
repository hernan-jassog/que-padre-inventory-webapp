import { mockRecipes } from '../../data/recipes/mockRecipes';
import { mockProducts } from '../../data/inventory/mockProducts';

export interface ParsedSale {
  dishName: string;
  quantitySold: number;
}

export interface DeductionPreview {
  productId: string;
  productName: string;
  quantityToDeduct: number;
  unit: string;
}

export class CalculateDeductionsUseCase {
  execute(sales: ParsedSale[]): DeductionPreview[] {
    const deductionMap = new Map<string, number>();

    for (const sale of sales) {
      // Find recipe by exact or partial match (for robustness)
      const recipe = mockRecipes.find(r => r.dishName.toLowerCase().trim() === sale.dishName.toLowerCase().trim());
      
      if (recipe) {
        for (const ingredient of recipe.ingredients) {
          const totalIngredientUsed = ingredient.quantityRequired * sale.quantitySold;
          const currentTotal = deductionMap.get(ingredient.productId) || 0;
          deductionMap.set(ingredient.productId, currentTotal + totalIngredientUsed);
        }
      } else {
        console.warn(`Platillo no encontrado en recetario: ${sale.dishName}`);
      }
    }

    // Convert map to array with product details
    const deductions: DeductionPreview[] = [];
    deductionMap.forEach((qty, productId) => {
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        deductions.push({
          productId,
          productName: product.name,
          quantityToDeduct: qty,
          unit: product.unit
        });
      }
    });

    return deductions;
  }
}
