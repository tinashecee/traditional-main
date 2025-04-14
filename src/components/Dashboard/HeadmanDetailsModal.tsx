import React from "react";
import { TraditionalLeader } from "../../lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HeadmanDetailsModalProps {
  headman: TraditionalLeader;
  isOpen: boolean;
  onClose: () => void;
}

const HeadmanDetailsModal = ({
  headman,
  isOpen,
  onClose,
}: HeadmanDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10">
          <DialogTitle>Headman Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 px-1">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ID</Label>
                <Input
                  value={headman.id ? headman.id.toString() : "N/A"}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Incumbent</Label>
                <Input value={headman.incumbent || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Headmanship</Label>
                <Input value={headman.headmanship || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input value={headman.status || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>ID Number</Label>
                <Input value={headman.id_number || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>EC Number</Label>
                <Input value={headman.ecnumber || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input value={headman.dateofbirth || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Date of Appointment</Label>
                <Input value={headman.dateofappointment || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Mutupo</Label>
                <Input value={headman.mutupo || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Input value={headman.gender || "N/A"} readOnly />
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
                <Input value={headman.contactnumber || "N/A"} readOnly />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Physical Address</Label>
                <Input value={headman.physicalladdress || "N/A"} readOnly />
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
                <Input value={headman.province || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input value={headman.district || "N/A"} readOnly />
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
                <Input value={headman.bank || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input value={headman.accountnumber || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Next of Kin</Label>
                <Input value={headman.nextofkin || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Car Registration</Label>
                <Input value={headman.car_reg_no || "N/A"} readOnly />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Spouses</Label>
                <Input value={headman.spouses || "N/A"} readOnly />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Offspring</Label>
                <Input value={headman.offspring || "N/A"} readOnly />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeadmanDetailsModal;
export { HeadmanDetailsModal };
