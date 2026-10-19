import LottieView from "lottie-react-native";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import { ThemedView } from "./ThemedView";

export default function LoadingIndicator({ type }: { type?: "screen" }) {
  const { theme } = useUnistyles();

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          type === "screen"
            ? theme.screen.default.backgroundColor
            : "transparent",
      }}
    >
      <ThemedView style={{ width: 22, height: 22 }}>
        <LottieView
          autoPlay
          loop
          style={{ width: 22, height: 22 }}
          source={
            UnistylesRuntime.themeName === "light"
              ? require("@/assets/lottie/loading_dots/loading_dots.json")
              : require("@/assets/lottie/loading_dots/loading_dots_white.json")
          }
        />
      </ThemedView>
    </ThemedView>
  );
}
