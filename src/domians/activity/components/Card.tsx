import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { deleteEvent, updateEvent } from "@/services/firebase/event";
import { Category } from "@/types/category";
import { Event } from "@/types/event";
import { Recurrence } from "@/types/recurrence";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addHours, format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

type ActivityFormData = {
  name: string;
  startTime: Date;
  endTime: Date;
  category: Category;
};
const now = new Date();

export function Card({
  selected,
  setSelected,
}: {
  selected: Event | null;
  setSelected: (event: Event | null) => void;
}) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const defaultValues = useMemo(() => {
    return {
      name: selected?.name ?? "",
      startTime: selected?.startDate.toDate() ?? addHours(now, 1),
      endTime: selected?.endDate.toDate() ?? addHours(now, 2),
      category: selected?.category ?? Category.Group,
    };
  }, [selected]);
  const methods = useForm<ActivityFormData>({ defaultValues });
  const [startTime] = useWatch({
    control: methods.control,
    name: ["startTime"],
  });
  const {
    mutate: mutateUpdate,
    isSuccess: isSuccessUpdate,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
  } = useMutation({
    mutationFn: async (data: ActivityFormData) => {
      if (!selected?.id) {
        throw new Error("Selecteer een activiteit om te wijzigen");
      }
      return await updateEvent(
        selected.id,
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
        queryKey: ["occurrence", selected?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["this-week-occurrences"],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrences-grouped"],
      });
      setTimeout(() => {
        if (selected?.id) {
          push(`/activity?id=${encodeURIComponent(selected.id)}`);
        }
      }, 3000);
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
      if (!selected?.id) {
        throw new Error("Selecteer een activiteit om te wijzigen");
      }
      return await deleteEvent(selected.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrence", selected?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["this-week-occurrences"],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrences-grouped"],
      });
      setSelected(null);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const selectedId = selected?.id ?? null;

  useEffect(() => {
    methods.reset(defaultValues);
    // Intentionally omit methods so we only reset when selection changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, defaultValues]);

  if (selected) {
    return (
      <form
        onSubmit={methods.handleSubmit((data) => mutateUpdate(data))}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4 bg-white p-4 pt-2 rounded-2xl w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)]">
          <div>
            <div className="flex justify-between items-center">
              <h2>{selected.name}</h2>
              <button onClick={() => setSelected(null)}>
                <FontAwesomeIcon icon={faXmark} className="max-h-4!" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {selected.recurrence &&
                `${selected.recurrence === Recurrence.Daily ? "Elke dag" : "Elke"} ${format(selected.startDate.toDate(), `${selected.recurrence === Recurrence.Weekly ? "EEEE" : selected.recurrence === Recurrence.Monthly ? "do" : ""} HH:mm`, { locale: nl })} - ${format(selected.endDate.toDate(), isSameDay(selected.endDate.toDate(), selected.startDate.toDate()) ? "HH:mm" : "EEEE HH:mm", { locale: nl })}`}
              {!selected.recurrence &&
                `${format(selected.startDate.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(selected.endDate.toDate(), isSameDay(selected.endDate.toDate(), selected.startDate.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
            </p>
          </div>

          {selected.recurrence && (
            <Alert type="info" size="small">
              Verandering aan deze activiteit worden toegepast op de hele reeks
              van deze activiteit.
            </Alert>
          )}

          {isSuccessUpdate && (
            <Alert type="success" size="small">
              Activiteit succesvol gewijzigd!{" "}
              <span className="text-success font-semibold">
                Navigeren naar activiteit detail pagina...
              </span>
            </Alert>
          )}
          {isErrorDelete && (
            <Alert type="danger" size="small">
              Er is een fout opgetreden bij het verwijderen van de activiteit
            </Alert>
          )}
          {isSuccessDelete && (
            <Alert type="success" size="small">
              Activiteit succesvol verwijderd!
            </Alert>
          )}
          {isErrorUpdate && (
            <Alert type="danger" size="small">
              Er is een fout opgetreden bij het wijzigen van de activiteit
            </Alert>
          )}
          <Controller
            name="name"
            control={methods.control}
            rules={{
              required: "Naam kan niet leeg zijn",
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                id="name"
                label="Naam"
                type="text"
                error={error?.message}
                placeholder="Activiteit naam"
                value={value}
                onChange={onChange}
              />
            )}
          />
          {!selected?.recurrence && (
            <Controller
              name="startTime"
              control={methods.control}
              rules={{
                required: "Start tijd kan niet leeg zijn",
                validate: (value) => {
                  if (value && value < now) {
                    return "Start tijd moet in de toekomst zijn";
                  }
                  return true;
                },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  id="startTime"
                  label="Start tijd"
                  type="datetime-local"
                  error={error?.message}
                  placeholder="Start tijd"
                  value={value ? format(value, "yyyy-MM-dd'T'HH:mm") : ""}
                  disabled={!!selected?.recurrence}
                  onChange={(
                    strOrEv: string | ChangeEvent<HTMLInputElement>,
                  ) => {
                    const newStartTime = new Date(
                      typeof strOrEv === "string"
                        ? strOrEv
                        : strOrEv.target.value,
                    );
                    onChange(newStartTime);
                    methods.setValue("endTime", addHours(newStartTime, 1));
                  }}
                />
              )}
            />
          )}
          {!selected.recurrence && (
            <Controller
              name="endTime"
              control={methods.control}
              rules={{
                required: "Eind tijd kan niet leeg zijn",
                validate: (value) => {
                  if (value && value < now) {
                    return "Eind tijd moet in de toekomst zijn";
                  }
                  if (value && startTime && value < startTime) {
                    return "Eind tijd moet na start tijd zijn";
                  }
                  return true;
                },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Input
                  id="endTime"
                  label="Eind tijd"
                  type="datetime-local"
                  error={error?.message}
                  placeholder="Eind tijd"
                  value={value ? format(value, "yyyy-MM-dd'T'HH:mm") : ""}
                  disabled={!!selected?.recurrence}
                  onChange={(
                    strOrEv: string | ChangeEvent<HTMLInputElement>,
                  ) => {
                    onChange(
                      new Date(
                        typeof strOrEv === "string"
                          ? strOrEv
                          : strOrEv.target.value,
                      ),
                    );
                  }}
                />
              )}
            />
          )}
          <Controller
            name="category"
            control={methods.control}
            rules={{
              required: "Categorie kan niet leeg zijn",
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Select
                label="Categorie"
                options={Object.values(Category)}
                error={error?.message}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            isPending={isPendingUpdate}
            disabled={!methods.formState.isDirty}
          >
            Wijzig activiteit
          </Button>
          <Button
            className="bg-error!"
            onClick={() => {
              if (
                confirm(
                  `Weet je zeker dat je ${selected?.name} wilt verwijderen?`,
                )
              ) {
                mutateDelete();
              }
            }}
            isPending={isPendingDelete}
            disabled={!selected}
          >
            Activiteit verwijderen
          </Button>
        </div>
      </form>
    );
  }
}
