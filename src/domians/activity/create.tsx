"use client";

import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { Category } from "@/types/category";
import { Status } from "@/types/status";
import { getEventColor } from "@/utils/getEventColor";
import { addHours, format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { ChangeEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

type ActivityFormData = {
  name: string;
  startTime: Date;
  endTime: Date;
  category: Category;
};

const defaultFormValues: ActivityFormData = {
  name: "",
  startTime: new Date(),
  endTime: addHours(new Date(), 1),
  category: Category.Group,
};

export function CreateActivityPage() {
  const methods = useForm<ActivityFormData>({
    defaultValues: defaultFormValues,
  });
  const [name, startTime, endTime, category] = useWatch({
    control: methods.control,
    name: ["name", "startTime", "endTime", "category"],
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
            <p className="text-sm text-gray-500">
              {`${format(startTime, "d LLLL HH:mm", { locale: nl })} - ${format(endTime, isSameDay(endTime, startTime) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
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
          <form onSubmit={() => {}} className="flex flex-col gap-3">
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
                  if (value < new Date()) {
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
                  if (value < new Date()) {
                    return "Eind tijd moet in de toekomst zijn";
                  }
                  if (value < methods.getValues("startTime")) {
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
                  required
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </form>
        </div>
      </div>
    </BaseDetailScreen>
  );
}
