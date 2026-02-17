import { Category } from "@/types/category";
import { getEventColor } from "./getEventColor";

export function getRandomEventColor(): string {
  const categories = Object.values(Category);
  const randomIndex = Math.floor(Math.random() * categories.length);
  const category = categories[randomIndex];

  return getEventColor(category);
}
