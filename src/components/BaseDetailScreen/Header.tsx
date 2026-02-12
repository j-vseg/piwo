import { BackButton } from "../BackButton";

export function Header({
  color = "bg-pastelOrange",
  title,
}: {
  color?: string;
  title?: string;
}) {
  return (
    <div className={`relative h-16 flex justify-center items-center ${color}`}>
      <div className="absolute left-4">
        <BackButton color={color} />
      </div>
      <h1 className="text-center">{title}</h1>
    </div>
  );
}