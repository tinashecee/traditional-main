import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TraditionalLeader } from "../../lib/types";

interface ChiefDetailsModalProps {
  chief: TraditionalLeader;
  isOpen: boolean;
  onClose: () => void;
}

export function ChiefDetailsModal({
  chief,
  isOpen,
  onClose,
}: ChiefDetailsModalProps) {
  if (!chief) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chief Details</DialogTitle>
        </DialogHeader>

        {chief && (
          <div className="space-y-6">
            {/* Documents Section */}
            <div className="grid grid-cols-2 gap-6">
              {/* Chief Picture */}
              <div className="space-y-2">
                <h3 className="font-semibold">Chief Picture</h3>
                <div className="border rounded-lg p-4">
                  {chief.picture ? (
                    <div className="relative">
                      <img
                        src={chief.picture}
                        alt={`Chief ${chief.incumbent}`}
                        className="w-full h-[200px] rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">
                        No picture available
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations Document */}
              <div className="space-y-2">
                <h3 className="font-semibold">Recommendations from Headman</h3>
                <div className="border rounded-lg p-4 h-[200px] flex items-center justify-center">
                  {chief.recommendationsfromheadman ? (
                    <a
                      href={chief.recommendationsfromheadman}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 text-blue-600 hover:text-blue-800">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>View Document</span>
                    </a>
                  ) : (
                    <span className="text-gray-500">No document available</span>
                  )}
                </div>
              </div>
            </div>

            {/* Chief Information */}
            <div className="grid grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">Basic Information</h3>
                <p>
                  <span className="font-medium">Chief ID:</span>{" "}
                  {chief.chief_id}
                </p>
                <p>
                  <span className="font-medium">ID Number:</span>{" "}
                  {chief.id_number}
                </p>
                <p>
                  <span className="font-medium">Gender:</span> {chief.gender}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {chief.status}
                </p>
                <p>
                  <span className="font-medium">Date of Birth:</span>{" "}
                  {chief.dateofbirth}
                </p>
                <p>
                  <span className="font-medium">Mutupo:</span> {chief.mutupo}
                </p>
                <p>
                  <span className="font-medium">EC Number:</span>{" "}
                  {chief.ecnumber}
                </p>
              </div>

              {/* Location Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">Location Information</h3>
                <p>
                  <span className="font-medium">Province:</span>{" "}
                  {chief.province}
                </p>
                <p>
                  <span className="font-medium">District:</span>{" "}
                  {chief.district}
                </p>
                <p>
                  <span className="font-medium">Chieftainship:</span>{" "}
                  {chief.chieftainship}
                </p>
                <p>
                  <span className="font-medium">Physical Address:</span>{" "}
                  {chief.physicalladdress}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
