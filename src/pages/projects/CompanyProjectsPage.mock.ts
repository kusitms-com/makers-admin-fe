export const PLACEHOLDER_THUMBNAIL_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='282' height='150' viewBox='0 0 282 150'%3E%3Crect width='282' height='150' fill='%23F1F2F4'/%3E%3C/svg%3E"

export interface CompanyProjectCard {
  id: string
  cardinal: number
  serviceName: string
  content: string
  imageUrl: string
}
