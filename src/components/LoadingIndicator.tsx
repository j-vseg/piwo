import LottieView from "lottie-react-native";
import { ThemedView } from "./ThemedView";

export default function LoadingIndicator() {
  return (
    <ThemedView style={{ width: 22, height: 22, alignSelf: "center" }}>
      <LottieView
        autoPlay
        loop
        style={{ width: 22, height: 22 }}
        source={require("@/assets/loading_dots.json")}
      />
    </ThemedView>
  );
}
