/** Short customer-facing reference derived from the reservation id. */
export function referenceOf(id: string): string {
  return id.slice(-8).toUpperCase();
}
