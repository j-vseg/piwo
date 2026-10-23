import { OS } from "@/constants/Os";
import ExpoBottomSheet, {
  BottomSheetScrollView,
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
  scrollable?: boolean;
  initialSnapIndex?: number;
};

export default function BottomSheet({
  children,
  title,
  isPresented,
  onDismiss,
  scrollable = true,
  initialSnapIndex = 0,
}: BottomSheetProps) {
  const { theme } = useUnistyles();
  const sheetRef = useRef<BottomSheetMethods>(null);

  useEffect(() => {
    if (isPresented) {
      sheetRef.current?.snapToIndex(initialSnapIndex);
    } else {
      sheetRef.current?.close();
    }
  }, [isPresented, initialSnapIndex]);

  const Wrapper = scrollable ? BottomSheetScrollView : BottomSheetView;

  return (
    <ExpoBottomSheet
      ref={sheetRef}
      snapPoints={["50%", "90%"]}
      enableDynamicSizing={false}
      index={-1}
      enablePanDownToClose
      onClose={onDismiss}
      backgroundStyle={{
        backgroundColor: theme.screen.default.backgroundColor,
      }}
    >
      <Wrapper style={scrollable ? undefined : { flex: 1 }}>
        <Header title={title} onClose={onDismiss} />
        {Platform.OS === OS.Web ? (
          <ThemedView
            type="container"
            style={scrollable ? undefined : { flex: 1 }}
          >
            {children}
          </ThemedView>
        ) : (
          <ThemedView
            style={[styles.container, scrollable ? undefined : { flex: 1 }]}
          >
            {children}
          </ThemedView>
        )}
      </Wrapper>
    </ExpoBottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));
