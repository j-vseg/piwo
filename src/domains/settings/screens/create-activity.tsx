import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import DateTimePicker from "@/components/DateTimePicker/DateTimePicker";
import Picker from "@/components/Picker";
import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Category } from "@/constants/Category";
import { Recurrence } from "@/constants/Recurrence";
import { AVAILABILITY_SELECTOR_STATUSES } from "@/constants/Status";
import { useEventColor } from "@/hooks/useEventColor";
import { queryClient } from "@/queryClient";
import { createEvent } from "@/services/firebase/event";
import { useMutation } from "@tanstack/react-query";
import { addHours } from "date-fns";
import { router } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { DisplayTime } from "../components/DisplayTime";

type ActivityFormData = {
  name: string;
  startTime: Date;
  endTime: Date;
  recurrence?: Recurrence;
  category: Category;
};

const now = new Date();

const CATEGORIES = Object.values(Category);
const RECURRENCES = Object.values(Recurrence);

function getDefaultFormValues(): ActivityFormData {
  return {
    name: "",
    startTime: addHours(now, 1),
    endTime: addHours(now, 2),
    recurrence: undefined,
    category: Category.Group,
  };
}

export default function CreateActivityScreen() {
  const { t } = useTranslation();
  const methods = useForm<ActivityFormData>({
    defaultValues: getDefaultFormValues(),
  });
  const [name, startTime, endTime, category, recurrence] = useWatch({
    control: methods.control,
    name: ["name", "startTime", "endTime", "category", "recurrence"],
  });
  const eventColor = useEventColor(category);
  const { mutate, isSuccess, isPending, isError } = useMutation({
    mutationFn: async (data: ActivityFormData) => {
      await createEvent(
        data.name,
        data.category,
        data.startTime,
        data.endTime,
        data.recurrence,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["this-week-occurrences"],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrences-grouped"],
      });
      setTimeout(() => {
        router.push("/(tabs)");
      }, 3000);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView type="container">
        <ThemedView style={styles.preview}>
          <ThemedView>
            <ThemedText type="bodyLarge">{name || "???"}</ThemedText>
            <DisplayTime
              startTime={startTime}
              endTime={endTime}
              recurrence={recurrence}
            />
          </ThemedView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonContainer}
          >
            {AVAILABILITY_SELECTOR_STATUSES.map((statusOption) => (
              <ThemedView
                key={statusOption}
                style={[styles.previewButton, { backgroundColor: eventColor }]}
              >
                <ThemedText type="button" style={styles.previewButtonText}>
                  {statusOption}
                </ThemedText>
              </ThemedView>
            ))}
          </ScrollView>
        </ThemedView>

        {isSuccess && (
          <Alert
            variant="success"
            size="regular"
            description={t("createActivity.success")}
          />
        )}
        {isError && (
          <Alert
            variant="warning"
            size="regular"
            description={t("createActivity.error")}
          />
        )}

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

          <DateTimePicker
            label={t("createActivity.startTimeLabel")}
            control={methods.control}
            name="startTime"
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

          <DateTimePicker
            label={t("createActivity.endTimeLabel")}
            control={methods.control}
            name="endTime"
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

          <ThemedView style={styles.recurrence}>
            <Picker
              label={t("createActivity.recurrenceLabel")}
              control={methods.control}
              name="recurrence"
              required={false}
              options={RECURRENCES}
              allowDeselect
            />
            <ThemedText type="bodySmaller">
              <Trans
                i18nKey={
                  recurrence
                    ? "createActivity.recurrenceHint"
                    : "createActivity.recurrenceHintNone"
                }
                components={{
                  bold: <ThemedText type="bodySmaller" weight="bold" />,
                }}
              />
            </ThemedText>
          </ThemedView>

          <Picker
            label={t("createActivity.categoryLabel")}
            control={methods.control}
            name="category"
            options={CATEGORIES}
            rules={{
              required: t("createActivity.categoryRequired"),
            }}
          />

          <Button
            content={t("createActivity.submitButton")}
            isPending={isPending}
            disabled={isSuccess}
            onPress={methods.handleSubmit((data) => mutate(data))}
            accessibilityLabel={t("createActivity.submitButton")}
            accessibilityHint={t("createActivity.submitHint")}
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scrollContent: {
    flexGrow: 1,
  },
  preview: {
    backgroundColor: theme.colors.light.white,
    borderRadius: 16,
    padding: theme.spacing(4),
    flexDirection: "column",
    gap: theme.spacing(4),
  },
  previewButton: {
    borderRadius: 8,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1),
    alignItems: "center",
  },
  form: {
    flexDirection: "column",
    gap: theme.spacing(4),
  },
  recurrence: {
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  buttonContainer: {
    flexGrow: 1,
    flexDirection: "row",
    gap: theme.spacing(2),
    justifyContent: "space-between",
  },
  previewButtonText: {
    fontFamily: theme.font.inter.regular.fontFamily,
    fontWeight: theme.font.inter.regular.fontWeight,
    fontSize: 16,
  },
}));
