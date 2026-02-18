import { Category } from "@/types/category";
import { getEventColor } from "./getEventColor";

export function getRandomEventColor(): string {
  const categoryValues = Object.values(Category);
  const randomIndex = Math.floor(Math.random() * 4);
  const category = categoryValues[randomIndex];

  return getEventColor(category);
}
