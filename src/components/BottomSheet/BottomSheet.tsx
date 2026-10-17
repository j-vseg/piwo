import { BottomSheet as ExpoUIBottomSheet, RNHostView } from "@expo/ui";
import { ReactNode } from "react";
import { useUnistyles } from "react-native-unistyles";
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

  return (
    <ExpoUIBottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      snapPoints={["half", "full"]}
      containerColor={theme.screen.default.backgroundColor}
    >
      <RNHostView>
        <>
          <Header title={title} onClose={onDismiss} />
          <ThemedView type="container">{children}</ThemedView>
        </>
      </RNHostView>
    </ExpoUIBottomSheet>
  );
}
