import { Badge } from "@/components/ui/badge"

interface OrderStatusBadgeProps {
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pending", variant: "secondary" as const }
      case "confirmed":
        return { label: "Confirmed", variant: "default" as const }
      case "processing":
        return { label: "Processing", variant: "default" as const }
      case "shipped":
        return { label: "Shipped", variant: "default" as const }
      case "delivered":
        return { label: "Delivered", variant: "default" as const }
      case "cancelled":
        return { label: "Cancelled", variant: "destructive" as const }
      default:
        return { label: "Unknown", variant: "secondary" as const }
    }
  }

  const config = getStatusConfig(status)

  return <Badge variant={config.variant}>{config.label}</Badge>
}
