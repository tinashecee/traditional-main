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

interface VillageHeadsDetailsModalProps {
  villageHead: TraditionalLeader | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VillageHeadsDetailsModal = ({
  villageHead,
  isOpen,
  onClose,
}: VillageHeadsDetailsModalProps) => {
  if (!villageHead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10">
          <DialogTitle>Village Head Details</DialogTitle>
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
                  value={villageHead.id ? villageHead.id.toString() : "N/A"}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Incumbent</Label>
                <Input value={villageHead.incumbent || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Villageship</Label>
                <Input value={villageHead.villageship || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input value={villageHead.status || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>ID Number</Label>
                <Input value={villageHead.id_number || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>EC Number</Label>
                <Input value={villageHead.ecnumber || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input value={villageHead.dateofbirth || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Date of Appointment</Label>
                <Input
                  value={villageHead.dateofappointment || "N/A"}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Mutupo</Label>
                <Input value={villageHead.mutupo || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Input value={villageHead.gender || "N/A"} readOnly />
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
                <Input value={villageHead.contactnumber || "N/A"} readOnly />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Physical Address</Label>
                <Input value={villageHead.physicalladdress || "N/A"} readOnly />
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
                <Input value={villageHead.province || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input value={villageHead.district || "N/A"} readOnly />
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
                <Input value={villageHead.bank || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input value={villageHead.accountnumber || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Next of Kin</Label>
                <Input value={villageHead.nextofkin || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Car Registration</Label>
                <Input value={villageHead.car_reg_no || "N/A"} readOnly />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Spouses</Label>
                <Input value={villageHead.spouses || "N/A"} readOnly />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Offspring</Label>
                <Input value={villageHead.offspring || "N/A"} readOnly />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
