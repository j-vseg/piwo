export enum Status {
  Present = "Aanwezig",
  Maybe = "Misschien",
  Later = "Later",
  Absent = "Afwezig",
}

/** Event card: three buttons; dubbelklik Aanwezig voor Later. */
export const AVAILABILITY_SELECTOR_STATUSES: readonly Status[] = [
  Status.Present,
  Status.Maybe,
  Status.Absent,
];
