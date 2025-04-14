import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Chief } from "@/types/supabase";

interface ChiefDetailsModalProps {
  chief: Chief;
  isOpen: boolean;
  onClose: () => void;
}

export function ChiefDetailsModal({ chief, isOpen, onClose }: ChiefDetailsModalProps) {
  if (!chief) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chief Details</DialogTitle>
        </DialogHeader>

        {chief && (
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Personal Information</h3>
              <p><span className="font-medium">Name:</span> {chief.name}</p>
              <p><span className="font-medium">Title:</span> {chief.title}</p>
              <p><span className="font-medium">Status:</span> {chief.status}</p>
              <p><span className="font-medium">Date of Birth:</span> {chief.date_of_birth}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Contact Information</h3>
              <p><span className="font-medium">Phone:</span> {chief.phone}</p>
              <p><span className="font-medium">Email:</span> {chief.email}</p>
              <p><span className="font-medium">Address:</span> {chief.address}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Administrative Information</h3>
              <p><span className="font-medium">Province:</span> {chief.province}</p>
              <p><span className="font-medium">District:</span> {chief.district}</p>
              <p><span className="font-medium">Ward:</span> {chief.ward}</p>
              <p><span className="font-medium">Village:</span> {chief.village}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Appointment Details</h3>
              <p><span className="font-medium">Appointment Date:</span> {chief.appointment_date}</p>
              <p><span className="font-medium">Installation Date:</span> {chief.installation_date}</p>
              <p><span className="font-medium">Gazette Number:</span> {chief.gazette_number}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
