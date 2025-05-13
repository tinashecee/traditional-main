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
import { updateHeadman, updateHeadmanFiles } from "@/lib/apiService";

interface HeadmanEditModalProps {
  headman: TraditionalLeader;
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
            accept={label.includes("Document") ? ".pdf,.doc,.docx" : "image/*"}
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

export function HeadmanEditModal({
  headman,
  isOpen,
  onClose,
  onUpdate,
  onShowMessage,
}: HeadmanEditModalProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (field: string, value: any) => {
    try {
      setIsLoading(true);

      if (
        field === "picture" ||
        field === "recommendationsfromchief" ||
        field === "supporting_document_ddc"
      ) {
        if (value instanceof File) {
          const files = {
            [field]: value,
          };
          const currentFilePath = headman[
            field as keyof TraditionalLeader
          ] as string;
          const result = await updateHeadmanFiles(
            headman.headman_id,
            files,
            currentFilePath
          );

          // Update database with new file path
          await updateHeadman(headman.headman_id, {
            [field]: result[field as keyof typeof result],
          });
        }
      } else {
        await updateHeadman(headman.headman_id, {
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
          <DialogTitle>Edit Headman: {headman.incumbent}</DialogTitle>
        </DialogHeader>

        {/* Preview Section */}

        <div className="space-y-6">
          {/* Documents Section */}
          <Field
            label="Status"
            value={headman.status}
            type="select"
            options={["SUBSTANTIVE", "ACTING", "DECEASED", "REMOVED"]}
            onEdit={() => setEditingField("status")}
            isEditing={editingField === "status"}
            onSave={(value) => handleSave("status", value)}
            onCancel={() => setEditingField(null)}
          />
          <div>
            <h3 className="font-semibold mb-4">Documents</h3>
            <div className="space-y-3">
              {/* Picture Preview and Edit */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Picture
                </Label>
                <div className="border rounded-lg p-3">
                  {headman.picture ? (
                    <div className="relative">
                      <img
                        src={`http://137.184.221.205/${headman.picture}`}
                        alt={`Headman ${headman.incumbent}`}
                        className="w-full h-[200px] object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingField("picture")}
                        className="absolute top-2 right-2">
                        Change Picture
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-[200px] bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-gray-500 mb-2">
                        No picture available
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingField("picture")}>
                        Add Picture
                      </Button>
                    </div>
                  )}
                  {editingField === "picture" && (
                    <div className="mt-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleSave("picture", e.target.files?.[0])
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingField(null)}
                        className="mt-2">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations from Chief Document */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Recommendations from Chief
                </Label>
                <div className="border rounded-lg p-4">
                  {headman.recommendationsfromchief ? (
                    <div className="flex items-center justify-between">
                      <a
                        href={`http://137.184.221.205/${headman.recommendationsfromchief}`}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingField("recommendationsfromchief")
                        }>
                        Change Document
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingField("recommendationsfromchief")
                      }
                      className="w-full">
                      Add Document
                    </Button>
                  )}
                  {editingField === "recommendationsfromchief" && (
                    <div className="mt-4">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          handleSave(
                            "recommendationsfromchief",
                            e.target.files?.[0]
                          )
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingField(null)}
                        className="mt-2">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Supporting Document DDC */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Supporting Document DDC
                </Label>
                <div className="border rounded-lg p-4">
                  {headman.supporting_document_ddc ? (
                    <div className="flex items-center justify-between">
                      <a
                        href={`http://137.184.221.205/${headman.supporting_document_ddc}`}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingField("supporting_document_ddc")
                        }>
                        Change Document
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingField("supporting_document_ddc")}
                      className="w-full">
                      Add Document
                    </Button>
                  )}
                  {editingField === "supporting_document_ddc" && (
                    <div className="mt-4">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          handleSave(
                            "supporting_document_ddc",
                            e.target.files?.[0]
                          )
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingField(null)}
                        className="mt-2">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <Field
                label="Headman ID"
                value={headman.headman_id}
                onEdit={() => setEditingField("headman_id")}
                isEditing={editingField === "headman_id"}
                onSave={(value) => handleSave("headman_id", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="ID Number"
                value={headman.id_number}
                onEdit={() => setEditingField("id_number")}
                isEditing={editingField === "id_number"}
                onSave={(value) => handleSave("id_number", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Incumbent"
                value={headman.incumbent}
                onEdit={() => setEditingField("incumbent")}
                isEditing={editingField === "incumbent"}
                onSave={(value) => handleSave("incumbent", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Gender"
                value={headman.gender}
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
            <div className="space-y-4">
              <Field
                label="Province"
                value={headman.province}
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
                value={headman.district}
                onEdit={() => setEditingField("district")}
                isEditing={editingField === "district"}
                onSave={(value) => handleSave("district", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Chieftainship"
                value={headman.chieftainship}
                onEdit={() => setEditingField("chieftainship")}
                isEditing={editingField === "chieftainship"}
                onSave={(value) => handleSave("chieftainship", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Headmanship"
                value={headman.headmanship}
                onEdit={() => setEditingField("headmanship")}
                isEditing={editingField === "headmanship"}
                onSave={(value) => handleSave("headmanship", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Physical Address"
                value={headman.physicalladdress}
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
            <div className="space-y-4">
              <Field
                label="Mutupo"
                value={headman.mutupo}
                onEdit={() => setEditingField("mutupo")}
                isEditing={editingField === "mutupo"}
                onSave={(value) => handleSave("mutupo", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="EC Number"
                value={headman.ecnumber}
                onEdit={() => setEditingField("ecnumber")}
                isEditing={editingField === "ecnumber"}
                onSave={(value) => handleSave("ecnumber", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Contact Number"
                value={headman.contactnumber}
                onEdit={() => setEditingField("contactnumber")}
                isEditing={editingField === "contactnumber"}
                onSave={(value) => handleSave("contactnumber", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Next of Kin"
                value={headman.nextofkin}
                onEdit={() => setEditingField("nextofkin")}
                isEditing={editingField === "nextofkin"}
                onSave={(value) => handleSave("nextofkin", value)}
                onCancel={() => setEditingField(null)}
              />
            </div>
          </div>

          {/* Banking Details */}
          <div>
            <h3 className="font-semibold mb-4">Banking Details</h3>
            <div className="space-y-4">
              <Field
                label="Bank"
                value={headman.bank}
                onEdit={() => setEditingField("bank")}
                isEditing={editingField === "bank"}
                onSave={(value) => handleSave("bank", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Account Number"
                value={headman.accountnumber}
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
            <div className="space-y-4">
              <Field
                label="Date of Birth"
                value={headman.dateofbirth}
                type="date"
                onEdit={() => setEditingField("dateofbirth")}
                isEditing={editingField === "dateofbirth"}
                onSave={(value) => handleSave("dateofbirth", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Date of Appointment"
                value={headman.dateofappointment}
                type="date"
                onEdit={() => setEditingField("dateofappointment")}
                isEditing={editingField === "dateofappointment"}
                onSave={(value) => handleSave("dateofappointment", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Date of Issue"
                value={headman.dateofissue}
                type="date"
                onEdit={() => setEditingField("dateofissue")}
                isEditing={editingField === "dateofissue"}
                onSave={(value) => handleSave("dateofissue", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Date of Death/Removal"
                value={headman.dateofdeathorremoval}
                type="date"
                onEdit={() => setEditingField("dateofdeathorremoval")}
                isEditing={editingField === "dateofdeathorremoval"}
                onSave={(value) => handleSave("dateofdeathorremoval", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Date of Vacancy"
                value={headman.dateofvacancy}
                type="date"
                onEdit={() => setEditingField("dateofvacancy")}
                isEditing={editingField === "dateofvacancy"}
                onSave={(value) => handleSave("dateofvacancy", value)}
                onCancel={() => setEditingField(null)}
              />
            </div>
          </div>

          {/* Family Information */}
          <div>
            <h3 className="font-semibold mb-4">Family Information</h3>
            <div className="space-y-4">
              <Field
                label="Spouses"
                value={headman.spouses}
                type="textarea"
                onEdit={() => setEditingField("spouses")}
                isEditing={editingField === "spouses"}
                onSave={(value) => handleSave("spouses", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Offspring"
                value={headman.offspring}
                type="textarea"
                onEdit={() => setEditingField("offspring")}
                isEditing={editingField === "offspring"}
                onSave={(value) => handleSave("offspring", value)}
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
              <Field
                label="Relationship to Last Incumbent"
                value={headman.relationshiptolastincumbent}
                onEdit={() => setEditingField("relationshiptolastincumbent")}
                isEditing={editingField === "relationshiptolastincumbent"}
                onSave={(value) =>
                  handleSave("relationshiptolastincumbent", value)
                }
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Last Incumbent Name"
                value={headman.lastincumbentname}
                onEdit={() => setEditingField("lastincumbentname")}
                isEditing={editingField === "lastincumbentname"}
                onSave={(value) => handleSave("lastincumbentname", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Last Incumbent ID Number"
                value={headman.lastincumbentidnumber}
                onEdit={() => setEditingField("lastincumbentidnumber")}
                isEditing={editingField === "lastincumbentidnumber"}
                onSave={(value) => handleSave("lastincumbentidnumber", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Reason of Vacancy"
                value={headman.reasonofvacancy}
                type="textarea"
                onEdit={() => setEditingField("reasonofvacancy")}
                isEditing={editingField === "reasonofvacancy"}
                onSave={(value) => handleSave("reasonofvacancy", value)}
                onCancel={() => setEditingField(null)}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="font-semibold mb-4">Additional Information</h3>
            <div className="space-y-4">
              <Field
                label="Personal Attributes and Qualifications"
                value={headman.personalattributesandqualifications}
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
                value={headman.disagreements}
                type="textarea"
                onEdit={() => setEditingField("disagreements")}
                isEditing={editingField === "disagreements"}
                onSave={(value) => handleSave("disagreements", value)}
                onCancel={() => setEditingField(null)}
              />
              <Field
                label="Other Information"
                value={headman.otherinfo}
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
