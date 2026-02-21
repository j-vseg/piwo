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
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Event } from "@/types/event";
import { getEventColor } from "@/utils/getEventColor";

type ActivityFormData = {
  name: string;
  recurrence?: Recurrence;
  category: Category;
};

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
          recurrence: selected?.recurrence ?? undefined,
          category: selected?.category ?? Category.Group,
        };
      }, [selected]);
  const methods = useForm<ActivityFormData>({ defaultValues });
  const [recurrence] = useWatch({
    control: methods.control,
    name: ["recurrence"],
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
      if (!methods.formState.isDirty) {
        methods.reset(defaultValues);
      }
    }, [defaultValues, methods]);

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
                className={`flex flex-col gap-2 p-3 rounded-2xl min-w-60 border-5 border-white ${selected?.id === event.id ? `${getEventColor(event.category)}` : "bg-white"}`}
                onClick={() => setSelected(event as Event)}
              >
                <h4 className="font-semibold font-poppins!">{event.name}</h4>
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
            <Controller
              name="recurrence"
              control={methods.control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <div className="flex flex-col gap-1">
                  <Select
                    label="Herhaling"
                    options={Object.values(Recurrence)}
                    error={error?.message}
                    required={false}
                    onChange={onChange}
                    value={value}
                    variant="recurrence"
                  />
                  <ErrorIndicator type="small">
                    {recurrence
                      ? "Deze activiteit wordt herhaald"
                      : "Deze activiteit wordt niet herhaald"}
                  </ErrorIndicator>
                </div>
              )}
            />
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
            <Button isPending={isPending}>Wijzig activiteit</Button>
          </form>
        </div>
      </div>
    </BaseDetailScreen>
  );
}
