import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Headman } from "@/types/supabase";

interface HeadmenDetailsModalProps {
  headman: Headman | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HeadmenDetailsModal({ headman, isOpen, onClose }: HeadmenDetailsModalProps) {
  if (!headman) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Headman Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Personal Information</h3>
            <p><span className="font-medium">Name:</span> {headman.name}</p>
            {headman.date_of_birth && (
              <p><span className="font-medium">Date of Birth:</span> {headman.date_of_birth}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Contact Information</h3>
            {headman.phone && (
              <p><span className="font-medium">Phone:</span> {headman.phone}</p>
            )}
            {headman.email && (
              <p><span className="font-medium">Email:</span> {headman.email}</p>
            )}
            {headman.address && (
              <p><span className="font-medium">Address:</span> {headman.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Administrative Information</h3>
            <p><span className="font-medium">Village:</span> {headman.village}</p>
            <p><span className="font-medium">Chiefdom:</span> {headman.chiefdom}</p>
            <p><span className="font-medium">Province:</span> {headman.province}</p>
            <p><span className="font-medium">Status:</span> {headman.status}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Appointment Details</h3>
            {headman.appointment_date && (
              <p><span className="font-medium">Appointment Date:</span> {headman.appointment_date}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
