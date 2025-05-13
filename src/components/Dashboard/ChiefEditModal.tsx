import { useState } from "react";
import { TraditionalLeader } from "../../lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateChief, updateChiefFiles } from "../../lib/apiService";
import { Snackbar } from "@/components/ui/snackbar";

interface ChiefEditModalProps {
  chief: TraditionalLeader;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  onShowMessage: (message: string, variant: "success" | "error") => void;
}

interface FieldProps {
  label: string;
  value: string;
  onEdit: () => void;
  isEditing: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
  type?: "text" | "date" | "select" | "textarea" | "file";
  options?: string[];
}

const Field = ({
  label,
  value,
  onEdit,
  isEditing,
  onSave,
  onCancel,
  type = "text",
  options = [],
}: FieldProps) => {
  const [editValue, setEditValue] = useState(value);

  if (!isEditing) {
    return (
      <div className="flex justify-between items-center py-2 border-b">
        <div>
          <Label className="text-sm font-medium text-gray-500">{label}</Label>
          <div className="mt-1">{value || "Not set"}</div>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="py-2 border-b">
      <Label className="text-sm font-medium text-gray-500">{label}</Label>
      <div className="mt-1 flex gap-2">
        {type === "select" ? (
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === "textarea" ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1"
          />
        ) : type === "file" ? (
          <Input
            type="file"
            onChange={(e) => setEditValue(e.target.files?.[0]?.name || "")}
            className="flex-1"
          />
        ) : (
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1"
          />
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSave(editValue)}>
            Save
          </Button>
        </div>
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
}: FieldProps) => {
  const [editValue, setEditValue] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setEditValue(e.target.files[0]);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex justify-between items-center py-2 border-b">
        <div>
          <Label className="text-sm font-medium text-gray-500">{label}</Label>
          <div className="mt-1">
            {value ? (
              label === "Picture" ? (
                <img
                  src={`http://137.184.221.205/${value}`}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded"
                />
              ) : (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  View Document
                </a>
              )
            ) : (
              "Not set"
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="py-2 border-b">
      <Label className="text-sm font-medium text-gray-500">{label}</Label>
      <div className="mt-1 flex gap-2">
        <div className="flex-1 space-y-2">
          <Input
            type="file"
            accept={label === "Picture" ? "image/*" : ".pdf,.doc,.docx"}
            onChange={handleFileChange}
            className="flex-1"
          />
          {editValue && label === "Picture" && (
            <img
              src={URL.createObjectURL(editValue)}
              alt="Preview"
              className="h-20 w-20 object-cover rounded"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSave(editValue as any)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export function ChiefEditModal({
  chief,
  isOpen,
  onClose,
  onUpdate,
  onShowMessage,
}: ChiefEditModalProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (field: string, value: any) => {
    try {
      setIsLoading(true);

      if (field === "picture" || field === "recommendationsfromheadman") {
        if (value instanceof File) {
          const files = {
            [field]: value,
          };
          // Pass the current filepath for deletion
          const currentFilePath = chief[
            field as keyof TraditionalLeader
          ] as string;
          const result = await updateChiefFiles(
            chief.chief_id,
            files,
            currentFilePath
          );
          await updateChief(chief.chief_id, {
            [field]: result[field],
          });
        }
      } else {
        await updateChief(chief.chief_id, {
          [field]: value,
        });
      }

      // Close modal first
      onClose();

      // Refresh data if needed
      if (onUpdate) {
        await onUpdate();
      }

      // Show success message through parent component
      onShowMessage(
        `${field
          .split(/(?=[A-Z])/)
          .join(" ")
          .toLowerCase()} updated successfully`,
        "success"
      );
    } catch (error) {
      console.error("Error saving field:", error);
      onShowMessage("Failed to update field. Please try again.", "error");
    } finally {
      setIsLoading(false);
      setEditingField(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Chief: {chief.incumbent}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <Field
              label="Status"
              value={chief.status}
              type="select"
              options={["SUBSTANTIVE", "ACTING", "DECEASED", "REMOVED"]}
              onEdit={() => setEditingField("status")}
              isEditing={editingField === "status"}
              onSave={(value) => handleSave("status", value)}
              onCancel={() => setEditingField(null)}
            />
            <FileField
              label="Picture"
              value={chief.picture}
              onEdit={() => setEditingField("picture")}
              isEditing={editingField === "picture"}
              onSave={(value) => handleSave("picture", value)}
              onCancel={() => setEditingField(null)}
            />
            <div>
              <h3 className="font-semibold mb-4">Basic Information</h3>
              <div className="space-y-2">
                <Field
                  label="Chief ID"
                  value={chief.chief_id}
                  onEdit={() => setEditingField("chief_id")}
                  isEditing={editingField === "chief_id"}
                  onSave={(value) => handleSave("chief_id", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="ID Number"
                  value={chief.id_number}
                  onEdit={() => setEditingField("id_number")}
                  isEditing={editingField === "id_number"}
                  onSave={(value) => handleSave("id_number", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Incumbent"
                  value={chief.incumbent}
                  onEdit={() => setEditingField("incumbent")}
                  isEditing={editingField === "incumbent"}
                  onSave={(value) => handleSave("incumbent", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Gender"
                  value={chief.gender}
                  type="select"
                  options={["Male", "Female", "Other"]}
                  onEdit={() => setEditingField("gender")}
                  isEditing={editingField === "gender"}
                  onSave={(value) => handleSave("gender", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="font-semibold mb-4">Location Information</h3>
              <div className="space-y-2">
                <Field
                  label="Province"
                  value={chief.province}
                  type="select"
                  options={[
                    "manicaland",
                    "matebeleland_south",
                    "matebeleland_north",
                    "midlands",
                    "mashonaland_west",
                    "mashonaland_east",
                    "masvingo",
                    "bulawayo",
                    "mashonaland_central",
                  ]}
                  onEdit={() => setEditingField("province")}
                  isEditing={editingField === "province"}
                  onSave={(value) => handleSave("province", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="District"
                  value={chief.district}
                  onEdit={() => setEditingField("district")}
                  isEditing={editingField === "district"}
                  onSave={(value) => handleSave("district", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Chieftainship"
                  value={chief.chieftainship}
                  onEdit={() => setEditingField("chieftainship")}
                  isEditing={editingField === "chieftainship"}
                  onSave={(value) => handleSave("chieftainship", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Physical Address"
                  value={chief.physicalladdress}
                  type="textarea"
                  onEdit={() => setEditingField("physicalladdress")}
                  isEditing={editingField === "physicalladdress"}
                  onSave={(value) => handleSave("physicalladdress", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className="font-semibold mb-4">Personal Details</h3>
              <div className="space-y-2">
                <Field
                  label="Mutupo"
                  value={chief.mutupo}
                  onEdit={() => setEditingField("mutupo")}
                  isEditing={editingField === "mutupo"}
                  onSave={(value) => handleSave("mutupo", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="EC Number"
                  value={chief.ecnumber}
                  onEdit={() => setEditingField("ecnumber")}
                  isEditing={editingField === "ecnumber"}
                  onSave={(value) => handleSave("ecnumber", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Contact Number"
                  value={chief.contactnumber}
                  onEdit={() => setEditingField("contactnumber")}
                  isEditing={editingField === "contactnumber"}
                  onSave={(value) => handleSave("contactnumber", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Next of Kin"
                  value={chief.nextofkin}
                  onEdit={() => setEditingField("nextofkin")}
                  isEditing={editingField === "nextofkin"}
                  onSave={(value) => handleSave("nextofkin", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Spouses"
                  value={chief.spouses}
                  type="textarea"
                  onEdit={() => setEditingField("spouses")}
                  isEditing={editingField === "spouses"}
                  onSave={(value) => handleSave("spouses", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Offspring"
                  value={chief.offspring}
                  type="textarea"
                  onEdit={() => setEditingField("offspring")}
                  isEditing={editingField === "offspring"}
                  onSave={(value) => handleSave("offspring", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>

            {/* Banking Details */}
            <div>
              <h3 className="font-semibold mb-4">Banking Details</h3>
              <div className="space-y-2">
                <Field
                  label="Bank"
                  value={chief.bank}
                  onEdit={() => setEditingField("bank")}
                  isEditing={editingField === "bank"}
                  onSave={(value) => handleSave("bank", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Account Number"
                  value={chief.accountnumber}
                  onEdit={() => setEditingField("accountnumber")}
                  isEditing={editingField === "accountnumber"}
                  onSave={(value) => handleSave("accountnumber", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>

            {/* Important Dates */}
            <div>
              <h3 className="font-semibold mb-4">Important Dates</h3>
              <div className="space-y-2">
                <Field
                  label="Date of Birth"
                  value={chief.dateofbirth}
                  type="date"
                  onEdit={() => setEditingField("dateofbirth")}
                  isEditing={editingField === "dateofbirth"}
                  onSave={(value) => handleSave("dateofbirth", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Date of Appointment"
                  value={chief.dateofappointment}
                  type="date"
                  onEdit={() => setEditingField("dateofappointment")}
                  isEditing={editingField === "dateofappointment"}
                  onSave={(value) => handleSave("dateofappointment", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Date of Issue"
                  value={chief.dateofissue}
                  type="date"
                  onEdit={() => setEditingField("dateofissue")}
                  isEditing={editingField === "dateofissue"}
                  onSave={(value) => handleSave("dateofissue", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Date of Death/Removal"
                  value={chief.dateofdeathorremoval}
                  type="date"
                  onEdit={() => setEditingField("dateofdeathorremoval")}
                  isEditing={editingField === "dateofdeathorremoval"}
                  onSave={(value) => handleSave("dateofdeathorremoval", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Date of Vacancy"
                  value={chief.dateofvacancy}
                  type="date"
                  onEdit={() => setEditingField("dateofvacancy")}
                  isEditing={editingField === "dateofvacancy"}
                  onSave={(value) => handleSave("dateofvacancy", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="font-semibold mb-4">Additional Information</h3>
              <div className="space-y-2">
                <Field
                  label="Car Registration Number"
                  value={chief.car_reg_no}
                  onEdit={() => setEditingField("car_reg_no")}
                  isEditing={editingField === "car_reg_no"}
                  onSave={(value) => handleSave("car_reg_no", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Appointed By"
                  value={chief.appointed_by}
                  onEdit={() => setEditingField("appointed_by")}
                  isEditing={editingField === "appointed_by"}
                  onSave={(value) => handleSave("appointed_by", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>

            {/* Previous Incumbent Information */}
            <div>
              <h3 className="font-semibold mb-4">
                Previous Incumbent Information
              </h3>
              <div className="space-y-2">
                <Field
                  label="Relationship to Last Incumbent"
                  value={chief.relationshiptolastincumbent}
                  onEdit={() => setEditingField("relationshiptolastincumbent")}
                  isEditing={editingField === "relationshiptolastincumbent"}
                  onSave={(value) =>
                    handleSave("relationshiptolastincumbent", value)
                  }
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Last Incumbent Name"
                  value={chief.lastincumbentname}
                  onEdit={() => setEditingField("lastincumbentname")}
                  isEditing={editingField === "lastincumbentname"}
                  onSave={(value) => handleSave("lastincumbentname", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Last Incumbent ID Number"
                  value={chief.lastincumbentidnumber}
                  onEdit={() => setEditingField("lastincumbentidnumber")}
                  isEditing={editingField === "lastincumbentidnumber"}
                  onSave={(value) => handleSave("lastincumbentidnumber", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Reason of Vacancy"
                  value={chief.reasonofvacancy}
                  type="textarea"
                  onEdit={() => setEditingField("reasonofvacancy")}
                  isEditing={editingField === "reasonofvacancy"}
                  onSave={(value) => handleSave("reasonofvacancy", value)}
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>

            {/* Documents and Qualifications */}
            <div>
              <h3 className="font-semibold mb-4">
                Documents and Qualifications
              </h3>
              <div className="space-y-2">
                <Field
                  label="Personal Attributes and Qualifications"
                  value={chief.personalattributesandqualifications}
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
                  value={chief.disagreements}
                  type="textarea"
                  onEdit={() => setEditingField("disagreements")}
                  isEditing={editingField === "disagreements"}
                  onSave={(value) => handleSave("disagreements", value)}
                  onCancel={() => setEditingField(null)}
                />
                <Field
                  label="Other Info"
                  value={chief.otherinfo}
                  type="textarea"
                  onEdit={() => setEditingField("otherinfo")}
                  isEditing={editingField === "otherinfo"}
                  onSave={(value) => handleSave("otherinfo", value)}
                  onCancel={() => setEditingField(null)}
                />
                <FileField
                  label="Recommendations from Headman"
                  value={`http://137.184.221.205/${chief.recommendationsfromheadman}`}
                  onEdit={() => setEditingField("recommendationsfromheadman")}
                  isEditing={editingField === "recommendationsfromheadman"}
                  onSave={(value) =>
                    handleSave("recommendationsfromheadman", value)
                  }
                  onCancel={() => setEditingField(null)}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
