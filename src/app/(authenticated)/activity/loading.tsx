import { LoadingIndicator } from "@/components/LoadingIndicator";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <LoadingIndicator />
    </div>
  );
}
