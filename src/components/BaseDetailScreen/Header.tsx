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
    <div className={`h-16 grid grid-cols-[5rem_1fr_5rem] items-center ${color}`}>
      <div className="pl-4">
        {canGoBack && <BackButton color={color} />}
      </div>
      <h1 className={`text-center line-clamp-2 ${(title?.length ?? 0) > 20 ? "pt-4 leading-[0.85]" : ""}`}>{title}</h1>
      <div />
    </div>
  );
}