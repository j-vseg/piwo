import { DocumentReference } from "firebase/firestore";
import { Status } from "./status";

export interface Availability {
  key: DocumentReference;
  status: Status;
}
