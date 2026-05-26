export function formatFees(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(value >= 1000000 ? 1 : 1)}L/yr`;
  }
  return `₹${value.toLocaleString("en-IN")}/yr`;
}

export function formatPackage(value: number): string {
  return `${value.toFixed(1).replace(/\.0$/, "")} LPA`;
}

export function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
