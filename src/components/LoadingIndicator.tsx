import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export function LoadingIndicator() {
  return (
    <div className="flex justify-center">
      <FontAwesomeIcon icon={faCircleNotch} size="lg" spin />
    </div>
  );
}
