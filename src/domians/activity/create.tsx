"use client";

import { Alert } from "@/components/Alert";
import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import Button from "@/components/Button";
import { ErrorIndicator } from "@/components/ErrorIndicator";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { createEvent } from "@/services/firebase/event";
import { Category } from "@/types/category";
import { Recurrence } from "@/types/recurrence";
import { Status } from "@/types/status";
import { getEventColor } from "@/utils/getEventColor";
import { useMutation } from "@tanstack/react-query";
import { addHours, format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

type ActivityFormData = {
  name: string;
  startTime: Date;
  endTime: Date;
  recurrence?: Recurrence;
  category: Category;
};
const now = new Date();
function getDefaultFormValues(): ActivityFormData {
  return {
    name: "",
    startTime: now,
    endTime: addHours(now, 1),
    recurrence: undefined,
    category: Category.Group,
  };
}

export function CreateActivityPage() {
  const { push } = useRouter();
  const methods = useForm<ActivityFormData>({
    defaultValues: getDefaultFormValues(),
  });
  const [name, startTime, endTime, category, recurrence] = useWatch({
    control: methods.control,
    name: ["name", "startTime", "endTime", "category", "recurrence"],
  });
  const { mutate, isSuccess, isPending, isError } = useMutation({
    mutationFn: async (data: ActivityFormData) => {
      return await createEvent(
        data.name,
        data.category,
        data.startTime,
        data.endTime,
        data.recurrence,
      );
    },
    onSuccess: (eventId) => {
      setTimeout(() => {
        push(`/activity?id=${encodeURIComponent(eventId)}`);
      }, 3000);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <BaseDetailScreen
      heightClass="h-27"
      title="Creëer activiteit"
      color="bg-pastelBlue"
    >
      <div className="flex flex-col gap-8">
        <div className="bg-white p-4 rounded-3xl flex flex-col gap-4">
          <div>
            <h2>{name || "???"}</h2>
            <p className="text-sm text-gray-500" suppressHydrationWarning>
              {startTime &&
                endTime &&
                `${format(startTime, "d LLLL HH:mm", { locale: nl })} - ${format(endTime, isSameDay(endTime, startTime) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
            </p>
          </div>
          <div className="flex justify-between">
            {Object.values(Status).map((statusOption) => (
              <button
                key={statusOption}
                className={`px-3 py-1 rounded-lg ${getEventColor(category ?? Category.Group)}`}
                disabled={true}
              >
                <p>{statusOption}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2>Creëer activiteit</h2>
          {isSuccess && (
            <Alert type="success" size="small">
              Activiteit succesvol aangemaakt!{" "}
              <span className="text-success font-semibold">
                Navigeren naar activiteit detail pagina...
              </span>
            </Alert>
          )}
          {isError && (
            <Alert type="danger" size="small">
              Er is een fout opgetreden bij het aanmaken van de activiteit
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
              name="startTime"
              control={methods.control}
              rules={{
                required: "Start tijd kan niet leeg zijn",
                validate: (value) => {
                  if (value < now) {
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
                  value={format(value, "yyyy-MM-dd'T'HH:mm")}
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
            <Controller
              name="endTime"
              control={methods.control}
              rules={{
                required: "Eind tijd kan niet leeg zijn",
                validate: (value) => {
                  if (value < now) {
                    return "Eind tijd moet in de toekomst zijn";
                  }
                  if (value < startTime) {
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
                  value={format(value, "yyyy-MM-dd'T'HH:mm")}
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
            <Button isPending={isPending}>Creëer activiteit</Button>
          </form>
        </div>
      </div>
    </BaseDetailScreen>
  );
}
