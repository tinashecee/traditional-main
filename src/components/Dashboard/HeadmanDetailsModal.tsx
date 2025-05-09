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
        <div className="border-b pb-6 mb-6">
          <h3 className="font-semibold mb-4">Document Previews</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Picture Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Picture
              </Label>
              <div className="border rounded-lg p-2 h-[200px] flex items-center justify-center bg-gray-50">
                {headman.picture ? (
                  <img
                    src={`http://137.184.221.205/${headman.picture}`}
                    alt={`Headman ${headman.incumbent}`}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : (
                  <span className="text-gray-400">No picture available</span>
                )}
              </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {/* Recommendations Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Chief's Recommendations
                </Label>
                <div className="border rounded-lg p-4 h-[200px] flex flex-col items-center justify-center bg-gray-50">
                  {headman.recommendationsfromchief ? (
                    <a
                      href={`http://137.184.221.205/${headman.recommendationsfromchief}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-blue-600 hover:text-blue-800">
                      <svg
                        className="w-12 h-12 mb-2"
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
                      View Recommendations
                    </a>
                  ) : (
                    <span className="text-gray-400">No document available</span>
                  )}
                </div>
              </div>

              {/* Supporting Document Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Supporting Document DDC
                </Label>
                <div className="border rounded-lg p-4 h-[200px] flex flex-col items-center justify-center bg-gray-50">
                  {headman.supporting_document_ddc ? (
                    <a
                      href={`http://137.184.221.205/${headman.supporting_document_ddc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-blue-600 hover:text-blue-800">
                      <svg
                        className="w-12 h-12 mb-2"
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
                      View Supporting Document
                    </a>
                  ) : (
                    <span className="text-gray-400">No document available</span>
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

export default HeadmanDetailsModal;
export { HeadmanDetailsModal };
