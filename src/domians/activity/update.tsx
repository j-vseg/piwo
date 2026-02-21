"use client";

import { Alert } from "@/components/Alert";
import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import Button from "@/components/Button";
import { ErrorIndicator } from "@/components/ErrorIndicator";
import Input from "@/components/Input";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import Select from "@/components/Select";
import { useAuth } from "@/contexts/auth";
import { fetchAllEvents } from "@/services/firebase/events";
import { Category } from "@/types/category";
import { Recurrence } from "@/types/recurrence";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { addHours, format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Event } from "@/types/event";
import { getEventColor } from "@/utils/getEventColor";

type ActivityFormData = {
  name: string;
  startTime: Date;
  endTime: Date;
  category: Category;
};
const now = new Date();

export function UpdateActivityPage() {
  const { push } = useRouter();
  const { user } = useAuth();
  const [selected, setSelected] = useState<Event | null>(null);
  const {
      data: events,
      isLoading: isLoadingEvents,
      isError: isErrorEvents,
    } = useQuery({
      queryKey: ["all-events"],
      queryFn: user
        ? () => fetchAllEvents()
        : skipToken,
      staleTime: 30 * 60 * 1000,
    });
  const defaultValues = useMemo(() => {
        return {
          name: selected?.name ?? "",
          startTime: selected?.startDate.toDate() ?? now,
          endTime: selected?.endDate.toDate() ?? now,
          category: selected?.category ?? Category.Group,
        };
      }, [selected]);
  const methods = useForm<ActivityFormData>({ defaultValues });
  const [startTime] = useWatch({
    control: methods.control,
    name: ["startTime"],
  });
  const { mutate, isSuccess, isPending, isError: isErrorUpdate } = useMutation({
    mutationFn: async (data: ActivityFormData) => {
      return;
    },
    onSuccess: (eventId) => {
      setTimeout(() => {
        push(`/activity?id=${encodeURIComponent("yes")}`);
      }, 3000);
    },
    onError: (error) => {
      console.error(error);
    },
  });

    useEffect(() => {
      if (selected || !methods.formState.isDirty) {
        methods.reset(defaultValues);
      }
    }, [selected, defaultValues, methods]);

  return (
    <BaseDetailScreen
      heightClass="h-22"
      title="Wijzig activiteit"
      color="bg-pastelBlue"
    >
      <div className="flex flex-col gap-8">
        {isLoadingEvents ? (
          <LoadingIndicator />
        ) : isErrorEvents ? (
          <ErrorIndicator>
            Er is een fout opgetreden bij het ophalen van de activiteiten
          </ErrorIndicator>
        ) : !events ? (
          <ErrorIndicator>
            Er zijn geen activiteiten gevonden om te wijzigen
          </ErrorIndicator>
        ) : (
          <div className="flex gap-4 overflow-x-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className={`flex flex-col gap-1 p-3 pt-2 rounded-2xl min-w-60 border-5 border-white ${selected?.id === event.id ? `${getEventColor(event.category)}` : "bg-white"}`}
                onClick={() => setSelected(event as Event)}
              >
                <h3 className="font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-500">
                  {event.recurrence &&
                    `${event.recurrence === Recurrence.Daily ? "Dagelijks" : "Elke"} ${format(event.startDate.toDate(), `${event.recurrence === Recurrence.Weekly ? "EEEE" : "do"} HH:mm`, { locale: nl })} - ${format(event.endDate.toDate(), isSameDay(event.endDate.toDate(), event.startDate.toDate()) ? "HH:mm" : "EEEE HH:mm", { locale: nl })}`}
                  {!event.recurrence &&
                    `${format(event.startDate.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(event.endDate.toDate(), isSameDay(event.endDate.toDate(), event.startDate.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <h2>Wijzig activiteit</h2>
          {selected?.recurrence && (
            <Alert type="info" size="small">
              Verandering aan deze activiteit worden toegepast op de hele reeks
              van deze activiteit.
            </Alert>
          )}
          {isSuccess && (
            <Alert type="success" size="small">
              Activiteit succesvol gewijzigd!{" "}
              <span className="text-success font-semibold">
                Navigeren naar activiteit detail pagina...
              </span>
            </Alert>
          )}
          {isErrorUpdate && (
            <Alert type="danger" size="small">
              Er is een fout opgetreden bij het wijzigen van de activiteit
            </Alert>
          )}
          <form
            onSubmit={methods.handleSubmit((data) => mutate(data))}
            className="flex flex-col gap-3"
          >
            <Controller
              name="name"
              control={methods.control}
              rules={{
                required: "Naam kan niet leeg zijn",
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
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
            {!selected?.recurrence && (
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
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Select
                  label="Categorie"
                  options={Object.values(Category)}
                  error={error?.message}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Button isPending={isPending} disabled={!methods.formState.isDirty}>Wijzig activiteit</Button>
          </form>
        </div>
      </div>
    </BaseDetailScreen>
  );
}
