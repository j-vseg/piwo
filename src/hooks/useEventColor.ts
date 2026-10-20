import { Category } from "@/constants/Category";
import { useUnistyles } from "react-native-unistyles";

export function useEventColor(category?: Category): string {
  const { theme } = useUnistyles();
  
    switch (category) {
    case Category.Group:
      return theme.colors.category.group;
    case Category.Weekend:
      return theme.colors.category.weekend;
    case Category.Camp:
      return theme.colors.category.camp;
    case Category.Action:
      return theme.colors.category.action;
    default:
      return theme.colors.category.group;
  }
}
