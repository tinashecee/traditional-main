import React from "react";
import { TraditionalLeader } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ChiefsDetailsModalProps {
  chief: TraditionalLeader;
  isOpen: boolean;
  onClose: () => void;
}

const ChiefsDetailsModal: React.FC<ChiefsDetailsModalProps> = ({
  chief,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10">
          <DialogTitle>Chief Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6">
          {/* Chief Picture */}
          <div className="space-y-2">
            <h3 className="font-semibold">Chief Picture</h3>
            <div className="border rounded-lg p-4">
              {chief.picture ? (
                <div className="relative">
                  <img
                    src={`http://137.184.221.205/${chief.picture}`}
                    alt={`Chief ${chief.incumbent}`}
                    className="w-full h-[200px] rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No picture available</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-4 py-4 px-1">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ID</Label>
                <Input
                  value={chief.id ? chief.id.toString() : "N/A"}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Incumbent</Label>
                <Input value={chief.incumbent || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Chieftainship</Label>
                <Input value={chief.chieftainship || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input value={chief.status || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>ID Number</Label>
                <Input value={chief.id_number || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>EC Number</Label>
                <Input value={chief.ecnumber || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input value={chief.dateofbirth || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Date of Appointment</Label>
                <Input value={chief.dateofappointment || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Mutupo</Label>
                <Input value={chief.mutupo || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Input value={chief.gender || "N/A"} readOnly />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={chief.contactnumber || "N/A"} readOnly />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Physical Address</Label>
                <Input value={chief.physicalladdress || "N/A"} readOnly />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Province</Label>
                <Input value={chief.province || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input value={chief.district || "N/A"} readOnly />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bank</Label>
                <Input value={chief.bank || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input value={chief.accountnumber || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Next of Kin</Label>
                <Input value={chief.nextofkin || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Car Registration</Label>
                <Input value={chief.car_reg_no || "N/A"} readOnly />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Spouses</Label>
                <Input value={chief.spouses || "N/A"} readOnly />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Offspring</Label>
                <Input value={chief.offspring || "N/A"} readOnly />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {/* Recommendations Document */}
              <div className="space-y-2">
                <h3 className="font-semibold">Recommendations from Headman</h3>
                <div className="border rounded-lg p-4 h-[200px] flex items-center justify-center">
                  {chief.recommendationsfromheadman ? (
                    <a
                      href={`http://137.184.221.205/${chief.recommendationsfromheadman}`}
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
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChiefsDetailsModal;
