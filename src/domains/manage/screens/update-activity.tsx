import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import DateTimePicker from "@/components/DateTimePicker/DateTimePicker";
import { ErrorMessage } from "@/components/ErrorMessage";
import LoadingIndicator from "@/components/LoadingIndicator";
import Picker from "@/components/Picker";
import { StatusButtonGroup } from "@/components/StatusButtonGroup";
import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Category } from "@/constants/Category";
import { OS } from "@/constants/Os";
import { Recurrence } from "@/constants/Recurrence";
import { queryClient } from "@/queryClient";
import { deleteEvent, getEvent, updateEvent } from "@/services/firebase/event";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { router } from "expo-router";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type ActivityFormData = {
  name: string;
  startTime: Date;
  endTime: Date;
  category: Category;
};

const now = new Date();

export default function UpdateActivityScreen({ id }: { id: string }) {
  const { t } = useTranslation();
  const {
    data: occurrence,
    isLoading: isLoadingOccurrence,
    isError: isErrorOccurrence,
  } = useQuery({
    queryKey: ["occurrence", id],
    queryFn: () => getEvent(id),
  });

  const methods = useForm<ActivityFormData>();

  useEffect(() => {
    if (occurrence) {
      methods.reset({
        name: occurrence.name,
        startTime: occurrence.startDate.toDate(),
        endTime: occurrence.endDate.toDate(),
        category: occurrence.category,
      });
    }
  }, [methods, occurrence]);

  const [startTime, category] = useWatch({
    control: methods.control,
    name: ["startTime", "category"],
  });
  const { isDirty } = methods.formState;
  const {
    mutate: mutateUpdate,
    isSuccess: isSuccessUpdate,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
  } = useMutation({
    mutationFn: async (data: ActivityFormData) => {
      return await updateEvent(
        id,
        data.name,
        data.category,
        data.startTime,
        data.endTime,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["event", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrence", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["this-week-occurrences"],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrences-grouped"],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const {
    mutate: mutateDelete,
    isSuccess: isSuccessDelete,
    isPending: isPendingDelete,
    isError: isErrorDelete,
  } = useMutation({
    mutationFn: async () => {
      return await deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["event", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrence", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["this-week-occurrences"],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrences-grouped"],
      });
      setTimeout(() => {
        router.push("/(tabs)/home");
      }, 3000);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (isLoadingOccurrence) {
    return <LoadingIndicator type="screen" />;
  }

  if (isErrorOccurrence || !occurrence) {
    return (
      <ErrorMessage type="screen">{t("activity.errorOccurrence")}</ErrorMessage>
    );
  }

  return (
    <ThemedView type="container" key={occurrence.id}>
      {isSuccessUpdate && (
        <Alert
          variant="success"
          size="regular"
          description={t("createActivity.updateSuccess")}
        />
      )}
      {isErrorUpdate && (
        <Alert
          variant="warning"
          size="regular"
          description={t("createActivity.updateError")}
        />
      )}
      {isSuccessDelete && (
        <Alert
          variant="success"
          size="regular"
          description={t("createActivity.deleteSuccess")}
        />
      )}
      {isErrorDelete && (
        <Alert
          variant="warning"
          size="regular"
          description={t("createActivity.deleteError")}
        />
      )}

      <ThemedView style={styles.preview}>
        <ThemedView style={styles.preview}>
          <ThemedText type="bodyLarge">{occurrence.name || "???"}</ThemedText>
          <ThemedText type="bodySmall" style={styles.subtitle}>
            {occurrence.recurrence &&
              `${occurrence.recurrence === Recurrence.Daily ? "Elke dag" : "Elke"} ${format(occurrence.startDate.toDate(), `${occurrence.recurrence === Recurrence.Weekly ? "EEEE" : occurrence.recurrence === Recurrence.Monthly ? "do" : ""} HH:mm`, { locale: nl })} - ${format(occurrence.endDate.toDate(), isSameDay(occurrence.endDate.toDate(), occurrence.startDate.toDate()) ? "HH:mm" : "EEEE HH:mm", { locale: nl })}`}
            {!occurrence.recurrence &&
              `${format(occurrence.startDate.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(occurrence.endDate.toDate(), isSameDay(occurrence.endDate.toDate(), occurrence.startDate.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
          </ThemedText>
        </ThemedView>
        <StatusButtonGroup disabled category={category} onSelect={() => {}} />
      </ThemedView>

      <ThemedView style={styles.form}>
        <TextInput
          label={t("createActivity.nameLabel")}
          control={methods.control}
          name="name"
          rules={{
            required: t("createActivity.nameRequired"),
          }}
          inputProps={{
            placeholder: t("createActivity.namePlaceholder"),
          }}
        />

        {!occurrence.recurrence && (
          <DateTimePicker
            label={t("createActivity.startTimeLabel")}
            control={methods.control}
            name="startTime"
            {...(Platform.OS === "android" && { mode: "datetime" })}
            rules={{
              required: t("createActivity.startTimeRequired"),
              validate: (value) => {
                if (!value) return t("createActivity.startTimeRequired");
                if (value < now) {
                  return t("createActivity.startTimeFuture");
                }
                return true;
              },
            }}
          />
        )}

        {!occurrence.recurrence && (
          <DateTimePicker
            label={t("createActivity.endTimeLabel")}
            control={methods.control}
            name="endTime"
            {...(Platform.OS === "android" && { mode: "datetime" })}
            rules={{
              required: t("createActivity.endTimeRequired"),
              validate: (value) => {
                if (!value) return t("createActivity.endTimeRequired");
                if (value < now) {
                  return t("createActivity.endTimeFuture");
                }
                if (value < startTime) {
                  return t("createActivity.endTimeAfterStart");
                }
                return true;
              },
            }}
          />
        )}

        <Picker
          label={t("createActivity.categoryLabel")}
          control={methods.control}
          name="category"
          options={Object.values(Category)}
          rules={{
            required: t("createActivity.categoryRequired"),
          }}
        />

        <Button
          content={t("createActivity.updateButton")}
          isPending={isPendingUpdate}
          disabled={!isDirty || isSuccessUpdate || isSuccessDelete}
          onPress={methods.handleSubmit((data) => mutateUpdate(data))}
          accessibilityLabel={t("createActivity.updateButton")}
          accessibilityHint={t("createActivity.updateHint")}
        />

        <Button
          content={t("createActivity.deleteButton")}
          isPending={isPendingDelete}
          disabled={isSuccessUpdate || isSuccessDelete}
          onPress={() => mutateDelete()}
          accessibilityLabel={t("createActivity.deleteButton")}
          accessibilityHint={t("createActivity.deleteHint")}
          type="error"
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scrollContent: {
    flexGrow: 1,
  },
  preview: {
    backgroundColor: theme.colors.light.white,
    borderRadius: theme.borderRadius["lg"],
    padding: theme.spacing(4),
    flexDirection: "column",
    gap: theme.spacing(4),
    ...theme.shadow,
  },
  previewText: {
    gap: Platform.OS === OS.Web ? theme.spacing(1) : theme.spacing(4),
  },
  form: {
    flexDirection: "column",
    gap: theme.spacing(6),
  },
  recurrence: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  subtitle: {
    color: theme.colors.dark.greyMedium,
  },
}));
