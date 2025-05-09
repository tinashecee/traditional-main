import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TraditionalLeader } from "../../lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { updateVillageHead } from "@/lib/apiService";

interface VillageHeadEditModalProps {
  villageHead: TraditionalLeader;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  onShowMessage: (message: string, variant: "success" | "error") => void;
}

interface FileFieldProps {
  label: string;
  value: string | null;
  onEdit: () => void;
  isEditing: boolean;
  onSave: (value: File) => void;
  onCancel: () => void;
  isDocument?: boolean;
}

interface FieldProps {
  label: string;
  value: string | null;
  type?: "text" | "textarea" | "select" | "date";
  options?: string[];
  onEdit: () => void;
  isEditing: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const Field = ({
  label,
  value,
  type = "text",
  options = [],
  onEdit,
  isEditing,
  onSave,
  onCancel,
}: FieldProps) => {
  const [tempValue, setTempValue] = useState(value || "");

  const handleSave = () => {
    onSave(tempValue);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-500">{label}</Label>
      <div className="border rounded-lg p-4">
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-900">{value || "Not set"}</div>
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {type === "textarea" ? (
              <Textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
            ) : type === "select" ? (
              <Select value={tempValue} onValueChange={setTempValue}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FileField = ({
  label,
  value,
  onEdit,
  isEditing,
  onSave,
  onCancel,
  isDocument = false,
}: FileFieldProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-500">{label}</Label>
      <div className="border rounded-lg p-4">
        {value ? (
          <div className="flex items-center justify-between">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
              <svg
                className="w-6 h-6"
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
              View Document
            </a>
            <Button variant="outline" size="sm" onClick={onEdit}>
              Change Document
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="w-full">
            Add Document
          </Button>
        )}
        {isEditing && (
          <div className="mt-4">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onSave(file);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="mt-2">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export function VillageHeadEditModal({
  villageHead,
  isOpen,
  onClose,
  onUpdate,
  onShowMessage,
}: VillageHeadEditModalProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (field: string, value: any) => {
    try {
      setIsLoading(true);

      if (
        field === "recommendationsfromchief" ||
        field === "recommendationsfromheadman" ||
        field === "supporting_document_ddc"
      ) {
        if (value instanceof File) {
          // File handling will be implemented later
          console.log("File upload to be implemented");
        }
      } else {
        // Update regular field
        await updateVillageHead(villageHead.villagehead_id, {
          [field]: value,
        });
      }

      onShowMessage(
        `${field
          .split(/(?=[A-Z])/)
          .join(" ")
          .toLowerCase()} updated successfully`,
        "success"
      );

      if (onUpdate) {
        await onUpdate();
      }

      onClose();
    } catch (error) {
      console.error("Error saving field:", error);
      onShowMessage("Failed to update field", "error");
    } finally {
      setIsLoading(false);
      setEditingField(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Village Head: {villageHead.incumbent}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section - Added as first field */}
          <div>
            <Field
              label="Status"
              value={villageHead.status}
              type="select"
              options={["SUBSTANTIVE", "ACTING"]}
              onEdit={() => setEditingField("status")}
              isEditing={editingField === "status"}
              onSave={(value) => handleSave("status", value)}
              onCancel={() => setEditingField(null)}
            />
          </div>

          {/* Documents Section */}
          <div>
            <h3 className="font-semibold mb-4">Documents</h3>
            <div className="space-y-4">
              <FileField
                label="Recommendations from Chief"
                value={villageHead.recommendationsfromchief}
                onEdit={() => setEditingField("recommendationsfromchief")}
                isEditing={editingField === "recommendationsfromchief"}
                onSave={(file) => handleSave("recommendationsfromchief", file)}
                onCancel={() => setEditingField(null)}
                isDocument
              />
              <FileField
                label="Recommendations from Headman"
                value={villageHead.recommendationsfromheadman}
                onEdit={() => setEditingField("recommendationsfromheadman")}
                isEditing={editingField === "recommendationsfromheadman"}
                onSave={(file) =>
                  handleSave("recommendationsfromheadman", file)
                }
                onCancel={() => setEditingField(null)}
                isDocument
              />
              <FileField
                label="Supporting Document DDC"
                value={villageHead.supporting_document_ddc}
                onEdit={() => setEditingField("supporting_document_ddc")}
                isEditing={editingField === "supporting_document_ddc"}
                onSave={(file) => handleSave("supporting_document_ddc", file)}
                onCancel={() => setEditingField(null)}
                isDocument
              />
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="ID Number"
                  value={villageHead.id_number}
                  onEdit={() => setEditingField("id_number")}
                  isEditing={editingField === "id_number"}
                  onSave={(value) => handleSave("id_number", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Incumbent"
                  value={villageHead.incumbent}
                  onEdit={() => setEditingField("incumbent")}
                  isEditing={editingField === "incumbent"}
                  onSave={(value) => handleSave("incumbent", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Gender"
                  value={villageHead.gender}
                  type="select"
                  options={["Male", "Female"]}
                  onEdit={() => setEditingField("gender")}
                  isEditing={editingField === "gender"}
                  onSave={(value) => handleSave("gender", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Status"
                  value={villageHead.status}
                  type="select"
                  options={["SUBSTANTIVE", "ACTING"]}
                  onEdit={() => setEditingField("status")}
                  isEditing={editingField === "status"}
                  onSave={(value) => handleSave("status", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field
                  label="Mutupo"
                  value={villageHead.mutupo}
                  onEdit={() => setEditingField("mutupo")}
                  isEditing={editingField === "mutupo"}
                  onSave={(value) => handleSave("mutupo", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="EC Number"
                  value={villageHead.ecnumber}
                  onEdit={() => setEditingField("ecnumber")}
                  isEditing={editingField === "ecnumber"}
                  onSave={(value) => handleSave("ecnumber", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Spouses"
                  value={villageHead.spouses}
                  type="textarea"
                  onEdit={() => setEditingField("spouses")}
                  isEditing={editingField === "spouses"}
                  onSave={(value) => handleSave("spouses", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="font-semibold mb-4">Location Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Field
                  label="Province"
                  value={villageHead.province}
                  type="select"
                  options={[
                    "Manicaland",
                    "Mashonaland Central",
                    "Mashonaland East",
                    "Mashonaland West",
                    "Masvingo",
                    "Matabeleland North",
                    "Matabeleland South",
                    "Midlands",
                  ]}
                  onEdit={() => setEditingField("province")}
                  isEditing={editingField === "province"}
                  onSave={(value) => handleSave("province", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="District"
                  value={villageHead.district}
                  onEdit={() => setEditingField("district")}
                  isEditing={editingField === "district"}
                  onSave={(value) => handleSave("district", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Chieftainship"
                  value={villageHead.chieftainship}
                  onEdit={() => setEditingField("chieftainship")}
                  isEditing={editingField === "chieftainship"}
                  onSave={(value) => handleSave("chieftainship", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Headmanship"
                  value={villageHead.headmanship}
                  onEdit={() => setEditingField("headmanship")}
                  isEditing={editingField === "headmanship"}
                  onSave={(value) => handleSave("headmanship", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Village"
                  value={villageHead.villagemanship}
                  onEdit={() => setEditingField("villagemanship")}
                  isEditing={editingField === "villagemanship"}
                  onSave={(value) => handleSave("villagemanship", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
              <Field
                label="Physical Address"
                value={villageHead.physicalladdress}
                type="textarea"
                onEdit={() => setEditingField("physicalladdress")}
                isEditing={editingField === "physicalladdress"}
                onSave={(value) => handleSave("physicalladdress", value)}
                onCancel={() => setEditingField(null)}
              />
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="font-semibold mb-4">Important Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Date of Birth"
                value={villageHead.dateofbirth}
                type="date"
                onEdit={() => setEditingField("dateofbirth")}
                isEditing={editingField === "dateofbirth"}
                onSave={(value) => handleSave("dateofbirth", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Date of Appointment"
                value={villageHead.dateofappointment}
                type="date"
                onEdit={() => setEditingField("dateofappointment")}
                isEditing={editingField === "dateofappointment"}
                onSave={(value) => handleSave("dateofappointment", value)}
                onCancel={() => setEditingField(null)}
              />
            </div>
          </div>

          {/* Previous Incumbent Information */}
          <div>
            <h3 className="font-semibold mb-4">
              Previous Incumbent Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Last Incumbent Name"
                  value={villageHead.lastincumbentname}
                  onEdit={() => setEditingField("lastincumbentname")}
                  isEditing={editingField === "lastincumbentname"}
                  onSave={(value) => handleSave("lastincumbentname", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Last Incumbent ID Number"
                  value={villageHead.lastincumbentidnumber}
                  onEdit={() => setEditingField("lastincumbentidnumber")}
                  isEditing={editingField === "lastincumbentidnumber"}
                  onSave={(value) => handleSave("lastincumbentidnumber", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
              <Field
                label="Relationship to Last Incumbent"
                value={villageHead.relationshiptolastincumbent}
                onEdit={() => setEditingField("relationshiptolastincumbent")}
                isEditing={editingField === "relationshiptolastincumbent"}
                onSave={(value) =>
                  handleSave("relationshiptolastincumbent", value)
                }
                onCancel={() => setEditingField(null)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Date of Vacancy"
                  value={villageHead.dateofvacancy}
                  type="date"
                  onEdit={() => setEditingField("dateofvacancy")}
                  isEditing={editingField === "dateofvacancy"}
                  onSave={(value) => handleSave("dateofvacancy", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Reason of Vacancy"
                  value={villageHead.reasonofvacancy}
                  type="textarea"
                  onEdit={() => setEditingField("reasonofvacancy")}
                  isEditing={editingField === "reasonofvacancy"}
                  onSave={(value) => handleSave("reasonofvacancy", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="font-semibold mb-4">Additional Information</h3>
            <div className="space-y-4">
              <Field
                label="Personal Attributes and Qualifications"
                value={villageHead.personalattributesandqualifications}
                type="textarea"
                onEdit={() =>
                  setEditingField("personalattributesandqualifications")
                }
                isEditing={
                  editingField === "personalattributesandqualifications"
                }
                onSave={(value) =>
                  handleSave("personalattributesandqualifications", value)
                }
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Disagreements"
                value={villageHead.disagreements}
                type="textarea"
                onEdit={() => setEditingField("disagreements")}
                isEditing={editingField === "disagreements"}
                onSave={(value) => handleSave("disagreements", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Other Information"
                value={villageHead.otherinfo}
                type="textarea"
                onEdit={() => setEditingField("otherinfo")}
                isEditing={editingField === "otherinfo"}
                onSave={(value) => handleSave("otherinfo", value)}
                onCancel={() => setEditingField(null)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
