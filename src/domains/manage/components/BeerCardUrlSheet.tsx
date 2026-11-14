import { Alert } from "@/components/Alert";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import LoadingIndicator from "@/components/LoadingIndicator";
import TextInput from "@/components/TextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { queryClient } from "@/queryClient";
import {
  type BeerCardType,
  getBeerCardUrl,
  updateBeerCardUrl,
} from "@/services/firebase/beer-card";
import { useTranslation } from "@/translations/i18n";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native-unistyles";

type UpdateUrlForm = {
  url: string;
};

export function BeerCardUrlSheet({
  open,
  setOpen,
  type,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  type: BeerCardType;
}) {
  const { t } = useTranslation();
  const { data: url, isLoading } = useQuery({
    queryKey: ["beer-card-url", type],
    queryFn: () => getBeerCardUrl(type),
  });
  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<UpdateUrlForm>({ defaultValues: { url: url ?? undefined } });
  const {
    isPending,
    isSuccess,
    isError,
    mutate,
    reset: resetMutation,
  } = useMutation({
    mutationFn: ({ url }: { url: string }) => updateBeerCardUrl(type, url),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["beer-card-url", type],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <BottomSheet
      title={t(`bestuur.beer_card.input.label.${type}`)}
      isPresented={open}
      onDismiss={() => {
        resetForm();
        resetMutation();
        setOpen(false);
      }}
    >
      <ThemedView style={styles.container}>
        {isLoading && <LoadingIndicator />}

        {isError && (
          <Alert
            variant="warning"
            description={t("bestuur.beer_card.error")}
            size={"regular"}
          />
        )}

        {isSuccess && (
          <Alert
            variant="success"
            description={t("bestuur.beer_card.success")}
            size={"regular"}
          />
        )}

        <ThemedText>{t("bestuur.beer_card.description")}</ThemedText>

        <TextInput
          label={t("bestuur.beer_card.input.label.title")}
          control={control}
          name="url"
          rules={{
            required: t("bestuur.beer_card.input.required"),
            pattern: {
              value:
                /^https:\/\/betaalverzoek\.rabobank\.nl\/betaalverzoek\/?.*$/,
              message: t("bestuur.beer_card.input.invalid"),
            },
          }}
          inputProps={{
            placeholder: t("bestuur.beer_card.input.placeholder"),
            autoCapitalize: "none",
            keyboardType: "url",
            autoComplete: "url",
            multiline: true,
          }}
        />

        <Button
          content={t("bestuur.beer_card.button.label")}
          accessibilityLabel={t("bestuur.beer_card.button.label")}
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
    gap: theme.spacing(8),
  },
}));
