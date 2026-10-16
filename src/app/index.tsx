import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
    } catch (e: any) {
      setError(e.message ?? "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText>Sign In</ThemedText>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        {error ? <ThemedText>{error}</ThemedText> : null}

        <Pressable
          onPress={handleSignIn}
          disabled={loading}
          style={[{ opacity: loading ? 0.6 : 1 }]}
        >
          {loading ? <ActivityIndicator /> : <ThemedText>Sign In</ThemedText>}
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.primitives.quinary,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing(6),
    gap: theme.spacing(4),
  },
}));
