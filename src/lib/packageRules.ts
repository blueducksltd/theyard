type PackageLike = {
  name?: string | null;
  description?: string | null;
  specs?: Array<string | null | undefined> | null;
} | null | undefined;

const SHUTDOWN_PACKAGE_KEYWORDS = [
  "shutdown the yard",
  "shut down the yard",
  "shutdown",
  "exclusive venue access",
  "exclusive venue control",
  "full venue buyout",
];

const normalizeText = (value: string): string => value.trim().toLowerCase();

export function isShutdownPackage(pkg: PackageLike): boolean {
  if (!pkg) return false;

  const haystack = [
    pkg.name,
    pkg.description,
    ...(pkg.specs ?? []),
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map(normalizeText)
    .join(" ");

  return SHUTDOWN_PACKAGE_KEYWORDS.some((keyword) => haystack.includes(keyword));
}