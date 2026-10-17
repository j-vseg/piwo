import { Group } from "@/components/Group";
import ListTile from "@/components/ListTile";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { OS } from "@/constants/Os";
import { auth } from "@/firebase";
import { deleteUserAccount } from "@/services/firebase/accounts";
import { getCurrentUser } from "@/services/firebase/auth";
import { getAuth as getNativeAuth } from "@react-native-firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ConfirmPassword } from "../components/ConfirmPassword";
import { SelectActivity } from "../components/SelectActivity";

type DeleteAccountFormData = {
  oldPassword: string;
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, rt } = useUnistyles();
  const [editActivityOpen, setEditActivityOpen] = useState(false);
  const [passwordConfirmOpen, setPasswordConfirmOpen] = useState(false);

  const user = getCurrentUser();
  const deleteAccountForm = useForm<DeleteAccountFormData>({
    defaultValues: { oldPassword: "" },
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: async (password: string) => {
      await deleteUserAccount(user!, password);
    },
    onSuccess: () => setPasswordConfirmOpen(false),
  });

  const handleDeleteConfirm = () => {
    deleteAccountForm.handleSubmit((data) => {
      mutateDelete(data.oldPassword.trim());
    })();
  };

  const { mutate: mutateLogout } = useMutation({
    mutationFn: async () => {
      if (Platform.OS !== OS.Web) {
        await getNativeAuth().signOut();
      } else {
        await signOut(auth);
      }
    },
  });

  return (
    <>
      <ThemedView
        type="container"
        style={{
          gap: theme.spacing(8),
          paddingTop:
            Platform.OS === OS.Web
              ? rt.insets.top + theme.spacing(6)
              : rt.insets.top + theme.spacing(4),
        }}
      >
        <ThemedText type="h1">{t("tabs.settings.main")}</ThemedText>

        <ThemedView style={styles.group}>
          <ThemedText type="h5">{t("settings.activitiesHeader")}</ThemedText>
          <Group>
            <ListTile
              text={t("tabs.settings.createActivity")}
              onPress={() => router.push("/(tabs)/settings/create-activity")}
            />
            <ListTile
              text={t("tabs.settings.editActivity")}
              onPress={() => setEditActivityOpen(true)}
            />
          </Group>
        </ThemedView>

        <ThemedView style={styles.group}>
          <ThemedText type="h5">{t("settings.accountHeader")}</ThemedText>
          <Group>
            <ListTile
              text={t("tabs.settings.personalDetails")}
              onPress={() => router.push("/(tabs)/settings/personal-details")}
            />
            <ListTile
              text={t("settings.signOut")}
              onPress={() => mutateLogout()}
            />
            <ListTile
              text={t("settings.deleteAccount")}
              onPress={() => setPasswordConfirmOpen(true)}
              textStyle={{ color: theme.colors.warnings.negative }}
            />
          </Group>
        </ThemedView>

        <ThemedView style={styles.group}>
          <ThemedText type="h5">{t("settings.aboutHeader")}</ThemedText>
          <Group>
            <ListTile
              text={t("settings.whatsNew")}
              onPress={() => console.log("yes")}
            />
            <ListTile
              text={t("settings.aboutApp")}
              onPress={() => console.log("yes")}
            />
          </Group>
        </ThemedView>
      </ThemedView>

      <SelectActivity
        editActivityOpen={editActivityOpen}
        setEditActivityOpen={setEditActivityOpen}
      />

      <ConfirmPassword
        isOpen={passwordConfirmOpen}
        onDismiss={() => setPasswordConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        control={deleteAccountForm.control as unknown as Control<FieldValues>}
        description={t("settings.deleteAccountDescription")}
      />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  group: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));
