import { ReactNode } from "react";

export default function Card({
  title,
  image,
  description,
  color,
}: {
  title: string;
  image: ReactNode;
  description: string;
  color: string;
}) {
  return (
    <div
      className={`shrink-0 w-full h-[60vh] snap-center flex flex-col justify-center items-center gap-8 px-10 ${color}`}
    >
      <h1>{title}</h1>
      <div className="-mt-3 mb-6">{image}</div>

      <p className="text-center">{description}</p>
    </div>
  );
}
