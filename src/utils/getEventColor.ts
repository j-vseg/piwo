import { Category } from "@/types/category";

export function getEventColor(category?: Category): string {
  switch (category) {
    case Category.Group:
      return "bg-orange";
    case Category.Weekend:
      return "bg-blue";
    case Category.Camp:
      return "bg-purple";
    case Category.Action:
      return "bg-teal";
    default:
        return "bg-orange";
  }
}
