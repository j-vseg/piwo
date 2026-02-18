import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export function BackButton({ color = "bg-pastelOrange" }: { color?: string }) {
  const router = useRouter();

  return (
    <button
      className={`h-12 w-12 backdrop-blur-md rounded-full shadow-md ${color} flex justify-center items-center`}
      onClick={() => router.back()}
    >
      <FontAwesomeIcon icon={faChevronLeft} className="max-h-4!" />
    </button>
  );
}