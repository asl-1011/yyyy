"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Login Required</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          You need to log in to select a delivery location.
        </p>
        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose()
              router.push("/login")
            }}
          >
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
