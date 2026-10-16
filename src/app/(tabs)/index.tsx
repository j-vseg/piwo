import {
  collection,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/themed-view";

interface Event {
  id: string;
  name: string;
}

export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getDocs(collection(getFirestore(), "events")).then((snapshot) => {
      setEvents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name ?? doc.id,
        })),
      );
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Events</ThemedText>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <ThemedView style={styles.item}>
              <ThemedText>{item.name}</ThemedText>
            </ThemedView>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.brand.primary,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: theme.gap(6),
    gap: theme.gap(4),
  },
  list: {
    flex: 1,
  },
  item: {
    padding: theme.gap(4),
    borderRadius: theme.radius.md,
    marginBottom: theme.gap(2),
  },
}));
