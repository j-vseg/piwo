import { getAuth, signOut } from "@react-native-firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

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
        <ThemedView style={styles.header}>
          <ThemedText type="h1">Events</ThemedText>
          <Pressable onPress={() => signOut(getAuth())}>
            <ThemedText>Sign Out</ThemedText>
          </Pressable>
        </ThemedView>
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
    backgroundColor: theme.colors.primitives.quinary,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: theme.spacing(6),
    gap: theme.spacing(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  list: {
    flex: 1,
  },
  item: {
    padding: theme.spacing(4),
    borderRadius: 16,
    marginBottom: theme.spacing(2),
  },
}));
