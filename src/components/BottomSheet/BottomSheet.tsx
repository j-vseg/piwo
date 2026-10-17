import { OS } from "@/constants/Os";
import ExpoBottomSheet, {
  BottomSheetView,
  type BottomSheetMethods,
} from "@expo/ui/community/bottom-sheet";
import { useEffect, useRef, type ReactNode } from "react";
import { Platform } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ThemedView } from "../ThemedView";
import Header from "./Header";

type BottomSheetProps = {
  children: ReactNode;
  title: string;
  isPresented: boolean;
  onDismiss: () => void;
};

export default function BottomSheet({
  children,
  title,
  isPresented,
  onDismiss,
}: BottomSheetProps) {
  const { theme } = useUnistyles();
  const sheetRef = useRef<BottomSheetMethods>(null);

  useEffect(() => {
    if (isPresented) {
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [isPresented]);

  return (
    <ExpoBottomSheet
      ref={sheetRef}
      snapPoints={["50%", "90%"]}
      index={-1}
      enablePanDownToClose
      onClose={onDismiss}
      backgroundStyle={{
        backgroundColor: theme.screen.default.backgroundColor,
      }}
    >
      <BottomSheetView>
        <Header title={title} onClose={onDismiss} />
        {Platform.OS === OS.Web ? (
          <ThemedView type="container">{children}</ThemedView>
        ) : (
          <ThemedView style={styles.container}>{children}</ThemedView>
        )}
      </BottomSheetView>
    </ExpoBottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing(4),
  },
}));
