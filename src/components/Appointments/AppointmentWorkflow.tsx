import React, { useState, useEffect } from "react";
import {
  handleChiefFileUpload,
  handleHeadmanFileUpload,
  handleVillageHeadFileUpload,
} from "@/lib/ftpUtils";
import {
  appointChief,
  appointHeadman,
  appointVillageHead,
  getMonthlyAppointments,
} from "../../lib/apiService";
import { TraditionalLeader, TraditionalArea } from "../../lib/types";
import { getChieftainships, getHeadmanships } from "../../lib/apiService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditFieldProps {
  label: string;
  value: string;
  name: keyof TraditionalLeader;
  type?: string;
  options?: string[];
  onSave: (name: keyof TraditionalLeader, value: string) => Promise<void>;
}

const EditField = ({
  label,
  value,
  name,
  type = "text",
  options,
  onSave,
}: EditFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(name, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error(`Error saving ${name}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between py-2 border-b">
        <div>
          <Label className="font-medium">{label}</Label>
          <div>{value || "Not set"}</div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 py-2 border-b">
      <div className="flex-1">
        <Label className="font-medium">{label}</Label>
        {options ? (
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger>
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
          />
        ) : (
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(false)}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

interface ChiefEditModalProps {
  chief: TraditionalLeader;
  isOpen: boolean;
  onClose: () => void;
}

export function ChiefEditModal({
  chief,
  isOpen,
  onClose,
}: ChiefEditModalProps) {
  const handleFieldSave = async (
    name: keyof TraditionalLeader,
    value: string
  ) => {
    try {
      // Will implement actual save later
      console.log("Saving", name, value);
    } catch (error) {
      console.error("Error updating chief:", error);
      throw error;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Chief: {chief.incumbent}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <EditField
            label="Chief ID"
            value={chief.chief_id}
            name="chief_id"
            onSave={handleFieldSave}
          />
          <EditField
            label="ID Number"
            value={chief.id_number}
            name="id_number"
            onSave={handleFieldSave}
          />
          <EditField
            label="Incumbent"
            value={chief.incumbent}
            name="incumbent"
            onSave={handleFieldSave}
          />
          <EditField
            label="District"
            value={chief.district}
            name="district"
            onSave={handleFieldSave}
          />
          <EditField
            label="Province"
            value={chief.province}
            name="province"
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
            onSave={handleFieldSave}
          />
          <EditField
            label="Chieftainship"
            value={chief.chieftainship}
            name="chieftainship"
            onSave={handleFieldSave}
          />
          <EditField
            label="Mutupo"
            value={chief.mutupo}
            name="mutupo"
            onSave={handleFieldSave}
          />
          <EditField
            label="EC Number"
            value={chief.ecnumber}
            name="ecnumber"
            onSave={handleFieldSave}
          />
          <EditField
            label="Gender"
            value={chief.gender}
            name="gender"
            options={["Male", "Female", "Other"]}
            onSave={handleFieldSave}
          />
          <EditField
            label="Bank"
            value={chief.bank}
            name="bank"
            onSave={handleFieldSave}
          />
          <EditField
            label="Account Number"
            value={chief.accountnumber}
            name="accountnumber"
            onSave={handleFieldSave}
          />
          <EditField
            label="Contact Number"
            value={chief.contactnumber}
            name="contactnumber"
            onSave={handleFieldSave}
          />
          <EditField
            label="Next of Kin"
            value={chief.nextofkin}
            name="nextofkin"
            onSave={handleFieldSave}
          />
          <EditField
            label="Picture"
            value={chief.picture || ""}
            name="picture"
            type="file"
            onSave={handleFieldSave}
          />
          <EditField
            label="Spouses"
            value={chief.spouses}
            name="spouses"
            type="textarea"
            onSave={handleFieldSave}
          />
          <EditField
            label="Offspring"
            value={chief.offspring}
            name="offspring"
            type="textarea"
            onSave={handleFieldSave}
          />
          <EditField
            label="Car Registration Number"
            value={chief.car_reg_no}
            name="car_reg_no"
            onSave={handleFieldSave}
          />
          <EditField
            label="Physical Address"
            value={chief.physicalladdress}
            name="physicalladdress"
            type="textarea"
            onSave={handleFieldSave}
          />
          <EditField
            label="Date of Birth"
            value={chief.dateofbirth}
            name="dateofbirth"
            type="date"
            onSave={handleFieldSave}
          />
          <EditField
            label="Date of Appointment"
            value={chief.dateofappointment}
            name="dateofappointment"
            type="date"
            onSave={handleFieldSave}
          />
          <EditField
            label="Date of Issue"
            value={chief.dateofissue}
            name="dateofissue"
            type="date"
            onSave={handleFieldSave}
          />
          <EditField
            label="Date of Death/Removal"
            value={chief.dateofdeathorremoval}
            name="dateofdeathorremoval"
            type="date"
            onSave={handleFieldSave}
          />
          <EditField
            label="Status"
            value={chief.status}
            name="status"
            options={["SUBSTANTIVE", "ACTING"]}
            onSave={handleFieldSave}
          />
          <EditField
            label="Relationship to Last Incumbent"
            value={chief.relationshiptolastincumbent}
            name="relationshiptolastincumbent"
            onSave={handleFieldSave}
          />
          <EditField
            label="Last Incumbent Name"
            value={chief.lastincumbentname}
            name="lastincumbentname"
            onSave={handleFieldSave}
          />
          <EditField
            label="Last Incumbent ID Number"
            value={chief.lastincumbentidnumber}
            name="lastincumbentidnumber"
            onSave={handleFieldSave}
          />
          <EditField
            label="Date of Vacancy"
            value={chief.dateofvacancy}
            name="dateofvacancy"
            type="date"
            onSave={handleFieldSave}
          />
          <EditField
            label="Reason of Vacancy"
            value={chief.reasonofvacancy}
            name="reasonofvacancy"
            type="textarea"
            onSave={handleFieldSave}
          />
          <EditField
            label="Personal Attributes and Qualifications"
            value={chief.personalattributesandqualifications}
            name="personalattributesandqualifications"
            type="textarea"
            onSave={handleFieldSave}
          />
          <EditField
            label="Disagreements"
            value={chief.disagreements}
            name="disagreements"
            type="textarea"
            onSave={handleFieldSave}
          />
          <EditField
            label="Other Info"
            value={chief.otherinfo}
            name="otherinfo"
            type="textarea"
            onSave={handleFieldSave}
          />
          <EditField
            label="Recommendations from Headman"
            value={chief.recommendationsfromheadman}
            name="recommendationsfromheadman"
            type="file"
            onSave={handleFieldSave}
          />
          <EditField
            label="Appointed By"
            value={chief.appointed_by}
            name="appointed_by"
            onSave={handleFieldSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

const steps = [
  { id: 1, name: "Location & Basic Info" },
  { id: 2, name: "Incumbent Info" },
  { id: 3, name: "Previous Incumbent" },
  { id: 4, name: "Additional Info" },
];

const StepsProgress = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="relative mt-2 mb-4">
      <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gray-200 -translate-y-1/2" />
      <div
        className="absolute left-0 top-1/2 h-0.5 bg-primary transition-all duration-500 -translate-y-1/2"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      <div className="relative flex justify-between">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${
              step.id <= currentStep ? "text-primary" : "text-gray-400"
            }`}>
            <div
              className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step.id <= currentStep
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white"
              }`}>
              {step.id}
            </div>
            <span className="mt-2 text-xs">{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AppointmentFormData
  extends Omit<
    Partial<TraditionalLeader>,
    | "supporting_document_ddc"
    | "supporting_document_chief"
    | "supporting_document_headman"
  > {
  supporting_document_ddc?: File;
  supporting_document_chief?: File;
  supporting_document_headman?: File;
}

const AppointmentWorkflow = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showChiefModal, setShowChiefModal] = useState(false);
  const [showHeadmanModal, setShowHeadmanModal] = useState(false);
  const [showVillageHeadModal, setShowVillageHeadModal] = useState(false);

  const [chiefStep, setChiefStep] = useState(1);
  const [headmanStep, setHeadmanStep] = useState(1);
  const [villageHeadStep, setVillageHeadStep] = useState(1);

  const [chiefFormData, setChiefFormData] = useState<AppointmentFormData>({});
  const [headmanFormData, setHeadmanFormData] = useState<AppointmentFormData>(
    {}
  );
  const [villageHeadFormData, setVillageHeadFormData] =
    useState<AppointmentFormData>({});

  const [chieftainships, setChieftainships] = useState<TraditionalArea[]>([]);
  const [headmanships, setHeadmanships] = useState<TraditionalArea[]>([]);

  const [monthlyChiefs, setMonthlyChiefs] = useState<TraditionalLeader[]>([]);
  const [monthlyHeadmen, setMonthlyHeadmen] = useState<TraditionalLeader[]>([]);
  const [monthlyVillageHeads, setMonthlyVillageHeads] = useState<
    TraditionalLeader[]
  >([]);
  const [selectedTab, setSelectedTab] = useState("chiefs");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both chieftainships and headmanships when component mounts
        const [chieftainshipsData, headmanshipsData] = await Promise.all([
          getChieftainships(),
          getHeadmanships(),
        ]);

        setChieftainships(
          Array.isArray(chieftainshipsData)
            ? chieftainshipsData
            : [chieftainshipsData]
        );
        setHeadmanships(
          Array.isArray(headmanshipsData)
            ? headmanshipsData
            : [headmanshipsData]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMonthlyAppointments = async () => {
      try {
        const { chiefs, headmen, villageheads } =
          await getMonthlyAppointments();
        setMonthlyChiefs(chiefs);
        setMonthlyHeadmen(headmen);
        setMonthlyVillageHeads(villageheads);
      } catch (error) {
        console.error("Error fetching monthly appointments:", error);
      }
    };

    fetchMonthlyAppointments();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formType: "chief" | "headman" | "villagehead"
  ) => {
    const setFormData = {
      chief: setChiefFormData,
      headman: setHeadmanFormData,
      villagehead: setVillageHeadFormData,
    }[formType];

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formType: "chief" | "headman" | "villagehead",
    docType: "chief" | "ddc" | "headman"
  ) => {
    if (e.target.files?.length) {
      const setFormData = {
        chief: setChiefFormData,
        headman: setHeadmanFormData,
        villagehead: setVillageHeadFormData,
      }[formType];

      // Update this section to handle all document types correctly
      const fileKey = {
        chief: "supporting_document_chief",
        ddc: "supporting_document_ddc",
        headman: "supporting_document_headman",
      }[docType];

      setFormData((prev) => ({
        ...prev,
        [fileKey]: e.target.files![0],
      }));
    }
  };

  const provinceDropdown = (setFormData: any) => (
    <div className="space-y-2">
      <Label htmlFor="province">Province</Label>
      <Select
        onValueChange={(value) =>
          setFormData((prev: any) => ({ ...prev, province: value }))
        }>
        <SelectTrigger>
          <SelectValue placeholder="Select province" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manicaland">Manicaland</SelectItem>
          <SelectItem value="matebeleland_south">Matebeleland South</SelectItem>
          <SelectItem value="matebeleland_north">Matebeleland North</SelectItem>
          <SelectItem value="midlands">Midlands</SelectItem>
          <SelectItem value="mashonaland_west">Mashonaland West</SelectItem>
          <SelectItem value="mashonaland_east">Mashonaland East</SelectItem>
          <SelectItem value="masvingo">Masvingo</SelectItem>
          <SelectItem value="bulawayo">Bulawayo</SelectItem>
          <SelectItem value="mashonaland_central">
            Mashonaland Central
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const chieftainshipDropdown = (setFormData: any) => (
    <div className="space-y-2">
      <Label htmlFor="chieftainship">Chieftainship</Label>
      <Select
        onValueChange={(value) => {
          const selectedChieftainship = chieftainships.find(
            (c) => c.id.toString() === value
          );
          if (selectedChieftainship) {
            setFormData((prev: any) => ({
              ...prev,
              chieftainship: selectedChieftainship.chieftainship,
            }));
          }
        }}>
        <SelectTrigger>
          <SelectValue placeholder="Select chieftainship" />
        </SelectTrigger>
        <SelectContent>
          {chieftainships.map((chieftainship) => (
            <SelectItem
              key={chieftainship.id}
              value={chieftainship.id.toString()}>
              {chieftainship.chieftainship}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const headmanshipDropdown = (setFormData: any) => (
    <div className="space-y-2">
      <Label htmlFor="headmanship">Headmanship</Label>
      <Select
        onValueChange={(value) => {
          const selectedHeadmanship = headmanships.find(
            (h) => h.id.toString() === value
          );
          if (selectedHeadmanship) {
            setFormData((prev) => ({
              ...prev,
              headmanship: selectedHeadmanship.headmanship,
            }));
          }
        }}>
        <SelectTrigger>
          <SelectValue placeholder="Select headmanship" />
        </SelectTrigger>
        <SelectContent>
          {headmanships.map((headmanship) => (
            <SelectItem key={headmanship.id} value={headmanship.id.toString()}>
              {headmanship.headmanship}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderChiefForm = () => {
    switch (chiefStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Location & Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {provinceDropdown(setChiefFormData)}
              {chieftainshipDropdown(setChiefFormData)}
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  name="district"
                  value={chiefFormData.district || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Appointment Status</Label>
                <Select
                  onValueChange={(value) =>
                    setChiefFormData((prev) => ({ ...prev, status: value }))
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUBSTANTIVE">SUBSTANTIVE</SelectItem>
                    <SelectItem value="ACTING">ACTING</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Incumbent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incumbent">Incumbent Name</Label>
                <Input
                  id="incumbent"
                  name="incumbent"
                  value={chiefFormData.incumbent || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_number">ID Number</Label>
                <Input
                  id="id_number"
                  name="id_number"
                  value={chiefFormData.id_number || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="dateofbirth"
                  type="date"
                  value={chiefFormData.dateofbirth || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) =>
                    setChiefFormData((prev) => ({ ...prev, gender: value }))
                  }
                  required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_appointment">Date of Appointment</Label>
                <Input
                  id="date_of_appointment"
                  name="dateofappointment"
                  type="date"
                  value={chiefFormData.dateofappointment || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Previous Incumbent Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last_incumbent_name">Last Incumbent Name</Label>
                <Input
                  id="last_incumbent_name"
                  name="lastincumbentname"
                  value={chiefFormData.lastincumbentname || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_incumbent_id">
                  Last Incumbent ID Number
                </Label>
                <Input
                  id="last_incumbent_id"
                  name="lastincumbentidnumber"
                  value={chiefFormData.lastincumbentidnumber || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">
                  Relationship to Last Incumbent
                </Label>
                <Input
                  id="relationship"
                  name="relationshiptolastincumbent"
                  value={chiefFormData.relationshiptolastincumbent || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_vacancy">Date of Vacancy</Label>
                <Input
                  id="date_of_vacancy"
                  name="dateofvacancy"
                  type="date"
                  value={chiefFormData.dateofvacancy || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="reason_of_vacancy">Reason for Vacancy</Label>
                <Textarea
                  id="reason_of_vacancy"
                  name="reasonofvacancy"
                  value={chiefFormData.reasonofvacancy || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Additional Information & Documents
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personal_attributes">
                  Personal Attributes & Qualifications
                </Label>
                <Textarea
                  id="personal_attributes"
                  name="personalattributesandqualifications"
                  value={
                    chiefFormData.personalattributesandqualifications || ""
                  }
                  onChange={(e) => handleInputChange(e, "chief")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disagreements">
                  Known Disagreements/Disputes
                </Label>
                <Textarea
                  id="disagreements"
                  name="disagreements"
                  value={chiefFormData.disagreements || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_info">Additional Information</Label>
                <Textarea
                  id="other_info"
                  name="otherinfo"
                  value={chiefFormData.otherinfo || ""}
                  onChange={(e) => handleInputChange(e, "chief")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supporting_document_ddc">
                  DDC Supporting Document
                </Label>
                <Input
                  id="supporting_document_ddc"
                  type="file"
                  onChange={(e) => handleFileChange(e, "chief", "ddc")}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
            </div>
          </div>
        );
    }
  };

  const renderHeadmanForm = () => {
    switch (headmanStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Location & Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {provinceDropdown(setHeadmanFormData)}
              {chieftainshipDropdown(setHeadmanFormData)}
              {headmanshipDropdown(setHeadmanFormData)}
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  name="district"
                  value={headmanFormData.district || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Appointment Status</Label>
                <Select
                  onValueChange={(value) =>
                    setHeadmanFormData((prev) => ({ ...prev, status: value }))
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUBSTANTIVE">SUBSTANTIVE</SelectItem>
                    <SelectItem value="ACTING">ACTING</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Incumbent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incumbent">Incumbent Name</Label>
                <Input
                  id="incumbent"
                  name="incumbent"
                  value={headmanFormData.incumbent || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_number">ID Number</Label>
                <Input
                  id="id_number"
                  name="id_number"
                  value={headmanFormData.id_number || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="dateofbirth"
                  type="date"
                  value={headmanFormData.dateofbirth || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) =>
                    setHeadmanFormData((prev) => ({ ...prev, gender: value }))
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_appointment">Date of Appointment</Label>
                <Input
                  id="date_of_appointment"
                  name="dateofappointment"
                  type="date"
                  value={headmanFormData.dateofappointment || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spouses">Spouses</Label>
                <Input
                  id="spouses"
                  name="spouses"
                  value={headmanFormData.spouses || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Previous Incumbent Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last_incumbent_name">Last Incumbent Name</Label>
                <Input
                  id="last_incumbent_name"
                  name="lastincumbentname"
                  value={headmanFormData.lastincumbentname || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_incumbent_id">
                  Last Incumbent ID Number
                </Label>
                <Input
                  id="last_incumbent_id"
                  name="lastincumbentidnumber"
                  value={headmanFormData.lastincumbentidnumber || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">
                  Relationship to Last Incumbent
                </Label>
                <Input
                  id="relationship"
                  name="relationshiptolastincumbent"
                  value={headmanFormData.relationshiptolastincumbent || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_vacancy">Date of Vacancy</Label>
                <Input
                  id="date_of_vacancy"
                  name="dateofvacancy"
                  type="date"
                  value={headmanFormData.dateofvacancy || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="reason_of_vacancy">Reason for Vacancy</Label>
                <Textarea
                  id="reason_of_vacancy"
                  name="reasonofvacancy"
                  value={headmanFormData.reasonofvacancy || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Additional Information & Documents
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personal_attributes">
                  Personal Attributes & Qualifications
                </Label>
                <Textarea
                  id="personal_attributes"
                  name="personalattributesandqualifications"
                  value={
                    headmanFormData.personalattributesandqualifications || ""
                  }
                  onChange={(e) => handleInputChange(e, "headman")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disagreements">
                  Known Disagreements/Disputes
                </Label>
                <Textarea
                  id="disagreements"
                  name="disagreements"
                  value={headmanFormData.disagreements || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_info">Additional Information</Label>
                <Textarea
                  id="other_info"
                  name="otherinfo"
                  value={headmanFormData.otherinfo || ""}
                  onChange={(e) => handleInputChange(e, "headman")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supporting_document_chief">
                  Chief's Supporting Document
                </Label>
                <Input
                  id="supporting_document_chief"
                  type="file"
                  onChange={(e) => handleFileChange(e, "headman", "chief")}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supporting_document_ddc">
                  DDC Supporting Document
                </Label>
                <Input
                  id="supporting_document_ddc"
                  type="file"
                  onChange={(e) => handleFileChange(e, "headman", "ddc")}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
            </div>
          </div>
        );
    }
  };

  const renderVillageHeadForm = () => {
    switch (villageHeadStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Location & Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {provinceDropdown(setVillageHeadFormData)}
              {chieftainshipDropdown(setVillageHeadFormData)}
              {headmanshipDropdown(setVillageHeadFormData)}
              <div className="space-y-2">
                <Label htmlFor="villagemanship">Village Name</Label>
                <Input
                  id="villagemanship"
                  name="villagemanship"
                  value={villageHeadFormData.villagemanship || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  name="district"
                  value={villageHeadFormData.district || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Appointment Status</Label>
                <Select
                  onValueChange={(value) =>
                    setVillageHeadFormData((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUBSTANTIVE">SUBSTANTIVE</SelectItem>
                    <SelectItem value="ACTING">ACTING</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Incumbent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incumbent">Incumbent Name</Label>
                <Input
                  id="incumbent"
                  name="incumbent"
                  value={villageHeadFormData.incumbent || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_number">ID Number</Label>
                <Input
                  id="id_number"
                  name="id_number"
                  value={villageHeadFormData.id_number || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="dateofbirth"
                  type="date"
                  value={villageHeadFormData.dateofbirth || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) =>
                    setVillageHeadFormData((prev) => ({
                      ...prev,
                      gender: value,
                    }))
                  }
                  required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_appointment">Date of Appointment</Label>
                <Input
                  id="date_of_appointment"
                  name="dateofappointment"
                  type="date"
                  value={villageHeadFormData.dateofappointment || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spouses">Spouses</Label>
                <Input
                  id="spouses"
                  name="spouses"
                  value={villageHeadFormData.spouses || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Previous Incumbent Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last_incumbent_name">Last Incumbent Name</Label>
                <Input
                  id="last_incumbent_name"
                  name="lastincumbentname"
                  value={villageHeadFormData.lastincumbentname || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_incumbent_id">
                  Last Incumbent ID Number
                </Label>
                <Input
                  id="last_incumbent_id"
                  name="lastincumbentidnumber"
                  value={villageHeadFormData.lastincumbentidnumber || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">
                  Relationship to Last Incumbent
                </Label>
                <Input
                  id="relationship"
                  name="relationshiptolastincumbent"
                  value={villageHeadFormData.relationshiptolastincumbent || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_vacancy">Date of Vacancy</Label>
                <Input
                  id="date_of_vacancy"
                  name="dateofvacancy"
                  type="date"
                  value={villageHeadFormData.dateofvacancy || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="reason_of_vacancy">Reason for Vacancy</Label>
                <Textarea
                  id="reason_of_vacancy"
                  name="reasonofvacancy"
                  value={villageHeadFormData.reasonofvacancy || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Additional Information & Documents
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personal_attributes">
                  Personal Attributes & Qualifications
                </Label>
                <Textarea
                  id="personal_attributes"
                  name="personalattributesandqualifications"
                  value={
                    villageHeadFormData.personalattributesandqualifications ||
                    ""
                  }
                  onChange={(e) => handleInputChange(e, "villagehead")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disagreements">
                  Known Disagreements/Disputes
                </Label>
                <Textarea
                  id="disagreements"
                  name="disagreements"
                  value={villageHeadFormData.disagreements || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_info">Additional Information</Label>
                <Textarea
                  id="other_info"
                  name="otherinfo"
                  value={villageHeadFormData.otherinfo || ""}
                  onChange={(e) => handleInputChange(e, "villagehead")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supporting_document_chief">
                  Chief's Supporting Document
                </Label>
                <Input
                  id="supporting_document_chief"
                  type="file"
                  onChange={(e) => handleFileChange(e, "villagehead", "chief")}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supporting_document_headman">
                  Headman's Supporting Document
                </Label>
                <Input
                  id="supporting_document_headman"
                  type="file"
                  onChange={(e) =>
                    handleFileChange(e, "villagehead", "headman")
                  }
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supporting_document_ddc">
                  DDC Supporting Document
                </Label>
                <Input
                  id="supporting_document_ddc"
                  type="file"
                  onChange={(e) => handleFileChange(e, "villagehead", "ddc")}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointments</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowChiefModal(true)}>
              Appoint Chief
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowHeadmanModal(true)}>
              Appoint Headman
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowVillageHeadModal(true)}>
              Appoint Village Head
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog
          open={showChiefModal}
          onOpenChange={(open) => {
            if (!open) {
              setChiefStep(1);
              setChiefFormData({});
              setSubmitError(null);
            }
            setShowChiefModal(open);
          }}>
          <DialogContent className="max-w-2xl">
            {submitError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {submitError}
              </div>
            )}
            <DialogHeader>
              <DialogTitle>New Chief Appointment</DialogTitle>
              <StepsProgress currentStep={chiefStep} />
            </DialogHeader>
            <div className="space-y-6">
              {renderChiefForm()}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    chiefStep > 1 && setChiefStep((prev) => prev - 1)
                  }
                  disabled={chiefStep === 1}>
                  Previous
                </Button>
                <Button
                  onClick={async () => {
                    if (chiefStep < 4) {
                      setChiefStep((prev) => prev + 1);
                    } else {
                      try {
                        setIsSubmitting(true);
                        setSubmitError(null);

                        // Upload supporting document if exists
                        let recommendationsPath = null;
                        if (chiefFormData.supporting_document_ddc) {
                          recommendationsPath = await handleChiefFileUpload(
                            chiefFormData.supporting_document_ddc
                          );
                        }

                        // Prepare chief data with file path
                        const chiefData = {
                          ...chiefFormData,
                          recommendationsfromheadman: recommendationsPath,
                          supporting_document_ddc: undefined, // Remove file object
                        };

                        // Submit to API
                        await appointChief(chiefData);

                        setShowChiefModal(false);
                        setChiefStep(1);
                        setChiefFormData({});
                      } catch (error) {
                        console.error("Error submitting chief:", error);
                        setSubmitError(
                          error instanceof Error
                            ? error.message
                            : "Failed to submit chief appointment"
                        );
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  disabled={isSubmitting}>
                  {chiefStep === 4 ? "Submit" : "Next"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showHeadmanModal}
          onOpenChange={(open) => {
            if (!open) {
              setHeadmanStep(1);
              setHeadmanFormData({});
              setSubmitError(null);
            }
            setShowHeadmanModal(open);
          }}>
          <DialogContent className="max-w-2xl">
            {submitError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {submitError}
              </div>
            )}
            <DialogHeader>
              <DialogTitle>New Headman Appointment</DialogTitle>
              <StepsProgress currentStep={headmanStep} />
            </DialogHeader>
            <div className="space-y-6">
              {renderHeadmanForm()}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    headmanStep > 1 && setHeadmanStep((prev) => prev - 1)
                  }
                  disabled={headmanStep === 1}>
                  Previous
                </Button>
                <Button
                  onClick={async () => {
                    if (headmanStep < 4) {
                      setHeadmanStep((prev) => prev + 1);
                    } else {
                      try {
                        setIsSubmitting(true);
                        setSubmitError(null);

                        // Upload both documents if they exist
                        let filePaths = null;
                        if (
                          headmanFormData.supporting_document_chief &&
                          headmanFormData.supporting_document_ddc
                        ) {
                          filePaths = await handleHeadmanFileUpload(
                            headmanFormData.supporting_document_chief,
                            headmanFormData.supporting_document_ddc
                          );
                        }

                        // Prepare headman data with file paths
                        const headmanData = {
                          ...headmanFormData,
                          recommendationsfromchief:
                            filePaths?.recommendationsfromchief || null,
                          supporting_document_ddc:
                            filePaths?.supporting_document_ddc || null,
                        };

                        // Submit to API
                        await appointHeadman(headmanData);

                        setShowHeadmanModal(false);
                        setHeadmanStep(1);
                        setHeadmanFormData({});
                        // Reload page to show updated list
                        window.location.reload();
                      } catch (error) {
                        console.error("Error submitting headman:", error);
                        setSubmitError(
                          error instanceof Error
                            ? error.message
                            : "Failed to submit headman appointment"
                        );
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  disabled={isSubmitting}>
                  {headmanStep === 4 ? "Submit" : "Next"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showVillageHeadModal}
          onOpenChange={setShowVillageHeadModal}>
          <DialogContent className="max-w-2xl">
            {submitError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {submitError}
              </div>
            )}
            <DialogHeader>
              <DialogTitle>New Village Head Appointment</DialogTitle>
              <StepsProgress currentStep={villageHeadStep} />
            </DialogHeader>
            <div className="space-y-6">
              {renderVillageHeadForm()}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    villageHeadStep > 1 &&
                    setVillageHeadStep((prev) => prev - 1)
                  }
                  disabled={villageHeadStep === 1}>
                  Previous
                </Button>
                <Button
                  onClick={async () => {
                    if (villageHeadStep < 4) {
                      setVillageHeadStep((prev) => prev + 1);
                    } else {
                      try {
                        setIsSubmitting(true);
                        setSubmitError(null);

                        // Upload all documents if they exist
                        let filePaths = null;
                        if (
                          villageHeadFormData.supporting_document_chief &&
                          villageHeadFormData.supporting_document_headman &&
                          villageHeadFormData.supporting_document_ddc
                        ) {
                          filePaths = await handleVillageHeadFileUpload(
                            villageHeadFormData.supporting_document_chief,
                            villageHeadFormData.supporting_document_headman,
                            villageHeadFormData.supporting_document_ddc
                          );
                        } else {
                          console.log(
                            "No files to upload for village head.",
                            villageHeadFormData.supporting_document_chief,
                            villageHeadFormData.supporting_document_headman,
                            villageHeadFormData.supporting_document_ddc
                          );
                        }

                        // Prepare village head data with file paths
                        const villageHeadData = {
                          ...villageHeadFormData,
                          recommendationsfromchief:
                            filePaths?.recommendationsfromchief || null,
                          recommendationsfromheadman:
                            filePaths?.recommendationsfromheadman || null,
                          supporting_document_ddc:
                            filePaths?.supporting_document_ddc || null,
                        };

                        // Submit to API
                        await appointVillageHead(villageHeadData);

                        setShowVillageHeadModal(false);
                        setVillageHeadStep(1);
                        setVillageHeadFormData({});
                        // Reload page to show updated list
                        //window.location.reload();
                      } catch (error) {
                        console.error("Error submitting village head:", error);
                        setSubmitError(
                          error instanceof Error
                            ? error.message
                            : "Failed to submit village head appointment"
                        );
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  disabled={isSubmitting}>
                  {villageHeadStep === 4 ? "Submit" : "Next"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Chiefs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Headmen</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">
                  Village Heads
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{monthlyChiefs.length}</div>
                <div className="text-xs text-muted-foreground">Chiefs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {monthlyHeadmen.length}
                </div>
                <div className="text-xs text-muted-foreground">Headmen</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {monthlyVillageHeads.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Village Heads
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Chiefs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Headmen</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">
                  Village Heads
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="chiefs"
        className="w-full"
        onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="chiefs">Chiefs</TabsTrigger>
          <TabsTrigger value="headmen">Headmen</TabsTrigger>
          <TabsTrigger value="village-heads">Village Heads</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Date of Appointment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                let appointments: TraditionalLeader[] = [];
                switch (selectedTab) {
                  case "chiefs":
                    appointments = monthlyChiefs;
                    break;
                  case "headmen":
                    appointments = monthlyHeadmen;
                    break;
                  case "village-heads":
                    appointments = monthlyVillageHeads;
                    break;
                }

                return appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id_number}>
                      <TableCell>{appointment.incumbent}</TableCell>
                      <TableCell>{appointment.id_number}</TableCell>
                      <TableCell>
                        {new Date(
                          appointment.dateofappointment
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{appointment.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground">
                      No appointments found for this month
                    </TableCell>
                  </TableRow>
                );
              })()}
            </TableBody>
          </Table>
        </div>
      </Tabs>
    </div>
  );
};

export default AppointmentWorkflow;
