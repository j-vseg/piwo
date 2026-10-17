import { Category } from "@/types/category";
import { lightTheme } from "@/themes/light";
import { getEventColor } from "./getEventColor";

type CategoryColors = typeof lightTheme.colors.category;

export function getRandomEventColor(categoryColors: CategoryColors): string {
  const categoryValues = Object.values(Category);
  const randomIndex = Math.floor(Math.random() * 4);
  const category = categoryValues[randomIndex];

  return getEventColor(category, categoryColors);
}
