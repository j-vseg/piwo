import LottieView from "lottie-react-native";
import { useUnistyles } from "react-native-unistyles";
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
          type === "screen" ? theme.screen.default.backgroundColor : undefined,
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
