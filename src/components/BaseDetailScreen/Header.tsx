import { BackButton } from "../BackButton";

export function Header({
  color = "bg-pastelOrange",
  title,
  canGoBack = true,
}: {
  color?: string;
  title?: string;
  canGoBack?: boolean;
}) {
  return (
    <div className={`relative h-16 flex justify-center items-center ${color}`}>
      {canGoBack && (
        <div className="absolute left-4">
          <BackButton color={color} />
        </div>
      )}
      <h1 className="text-center">{title}</h1>
    </div>
  );
}