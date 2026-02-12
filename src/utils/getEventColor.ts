import { Category } from "@/types/category";

export function getEventColor(category?: Category): string {
  switch (category) {
    case Category.Group:
      return "bg-pastelOrange";
    case Category.Weekend:
      return "bg-pastelBlue";
    case Category.Camp:
      return "bg-pastelPurple";
    case Category.Action:
      return "bg-pastelGreen";
    default:
        return "bg-orange";
  }
}
