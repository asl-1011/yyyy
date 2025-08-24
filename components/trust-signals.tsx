import { Shield, Award, Users, Clock } from "lucide-react"

export function TrustSignals() {
  return (
    <div className="bg-secondary/20 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-foreground">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-foreground">ISO Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-foreground">10,000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-foreground">24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  )
}
