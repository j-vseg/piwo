import LottieView from "lottie-react-native";
import { useUnistyles } from "react-native-unistyles";
import { ThemedView } from "./ThemedView";

export default function LoadingIndicator() {
  const { theme } = useUnistyles();

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.screen.default.backgroundColor,
      }}
    >
      <ThemedView style={{ width: 22, height: 22 }}>
        <LottieView
          autoPlay
          loop
          style={{ width: 22, height: 22 }}
          source={require("@/assets/loading_dots.json")}
        />
      </ThemedView>
    </ThemedView>
  );
}
