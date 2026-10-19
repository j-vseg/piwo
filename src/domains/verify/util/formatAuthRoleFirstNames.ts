export function formatAuthRoleFirstNames(
  accounts?: { firstName: string }[],
): string {
  if (!accounts || accounts.length === 0) {
    return "";
  }

  const names = accounts
    .map((account) => account.firstName?.trim())
    .filter((name): name is string => Boolean(name));

  if (names.length <= 1) {
    return names[0] ?? "";
  }

  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")} of ${names[names.length - 1]}`;
}