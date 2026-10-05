import { Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useAppColors() {
  const systemScheme = useColorScheme();
  const colorScheme = systemScheme === "dark" ? "dark" : "light";
  return Colors[colorScheme];
}
