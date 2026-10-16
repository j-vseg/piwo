import {
    getAuth,
    signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { useForm } from "react-hook-form";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit({ email, password }: LoginForm) {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
    } finally {
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText>Sign In</ThemedText>

        <TextInput
          control={control}
          name="email"
          inputProps={{
            placeholder: "Email",
            autoCapitalize: "none",
            keyboardType: "email-address",
            autoComplete: "email",
          }}
        />

        <TextInput
          control={control}
          name="password"
          inputProps={{
            placeholder: "Password",
            secureTextEntry: true,
            autoComplete: "password",
          }}
        />

        <Pressable onPress={handleSubmit(onSubmit)}>
          <ThemedText>Submit</ThemedText>
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
