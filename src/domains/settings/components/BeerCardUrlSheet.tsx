import { Alert } from "@/components/Alert";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { queryClient } from "@/queryClient";
import { updateBeerCardUrl } from "@/services/firebase/beer-card";
import { useTranslation } from "@/translations/i18n";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native-unistyles";

type UpdateUrlForm = {
  url: string;
};

export function BeerCardUrlSheet({
  open,
  setOpen,
  url,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  url: string;
}) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<UpdateUrlForm>({ defaultValues: { url } });
  const {
    isPending,
    isSuccess,
    isError,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: ({ url }: { url: string }) => updateBeerCardUrl(url),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["beer-card-url"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <BottomSheet
      title={t("settings.beer_card.input.label")}
      isPresented={open}
      onDismiss={() => {
        resetForm();
        resetMutation();
        setOpen(false);
      }}
    >
      <ThemedView style={styles.container}>
        {isError && (
          <Alert
            variant="warning"
            description={t("settings.beer_card.error")}
            size={"regular"}
          />
        )}

        {isSuccess && (
          <Alert
            variant="success"
            description={t("settings.beer_card.success")}
            size={"regular"}
          />
        )}

        <ThemedText>{t("settings.beer_card.description")}</ThemedText>

        <TextInput
          label={t("settings.beer_card.input.label")}
          control={control}
          name="url"
          rules={{
            required: t("settings.beer_card.input.required"),
            pattern: {
              value: /^https:\/\/betaalverzoek\.rabobank\.nl\/betaalverzoek\/?.*$/,
              message: t("settings.beer_card.input.invalid"),
            },
          }}
          inputProps={{
            placeholder: t("settings.beer_card.input.placeholder"),
            autoCapitalize: "none",
            keyboardType: "url",
            autoComplete: "url",
            multiline: true,
          }}
        />

        <Button
          content={t("settings.beer_card.button.label")}
          accessibilityLabel={t("settings.beer_card.button.label")}
          accessibilityHint={""}
          isPending={isPending}
          onPress={handleSubmit((data) => mutate({ url: data.url }))}
        />
      </ThemedView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing(4),
  },
}));
