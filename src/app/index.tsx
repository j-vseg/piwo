import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/themed-view";

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
        <ThemedText type="subtitle">Sign In</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={styles.input.color}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={styles.input.color}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        {error ? (
          <ThemedText type="small" style={styles.errorText}>
            {error}
          </ThemedText>
        ) : null}

        <Pressable
          onPress={handleSignIn}
          disabled={loading}
          style={[styles.button, { opacity: loading ? 0.6 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color={styles.buttonText.color} />
          ) : (
            <ThemedText style={styles.buttonText}>Sign In</ThemedText>
          )}
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.brand.primary,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.gap(6),
    gap: theme.gap(4),
  },
  input: {
    padding: theme.gap(4),
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.elevated,
    color: theme.colors.content.secondary,
    ...theme.typography.body,
  },
  button: {
    padding: theme.gap(4),
    borderRadius: theme.radius.md,
    alignItems: "center" as const,
    backgroundColor: theme.colors.content.primary,
  },
  buttonText: {
    color: theme.colors.content.inverse,
    ...theme.typography.button,
  },
  errorText: {
    color: theme.colors.semantic.error,
  },
}));
