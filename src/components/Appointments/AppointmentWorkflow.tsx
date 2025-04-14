import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, ChevronRight, ChevronLeft, Plus, FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";

interface AppointmentStats {
  newAppointments: number;
  pendingApprovals: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
}

interface Appointment {
  id: string;
  name: string;
  position: string;
  area: string;
  province: string;
  status: string;
  submittedDate: string;
  completedDate?: string;
  rejectionReason?: string;
  progress?: number;
}

const AppointmentWorkflow = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState<AppointmentStats>({
    newAppointments: 0,
    pendingApprovals: 0,
    approvedThisMonth: 0,
    rejectedThisMonth: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Mock stats data
  useEffect(() => {
    setStats({
      newAppointments: 12,
      pendingApprovals: 8,
      approvedThisMonth: 15,
      rejectedThisMonth: 3
    });
  }, []);

  // Mock data for appointments
  const allAppointments: Appointment[] = [
    {
      id: "AP001",
      name: "Tafadzwa Moyo",
      position: "Chief",
      area: "Mutasa",
      province: "Manicaland",
      status: "Local Review",
      submittedDate: "2023-10-15",
      progress: 25,
    },
    {
      id: "AP002",
      name: "Nyasha Chikwanda",
      position: "Headman",
      area: "Chivi",
      province: "Masvingo",
      status: "Provincial Review",
      submittedDate: "2023-09-28",
      progress: 50,
    },
    {
      id: "AP003",
      name: "Tendai Mupfumi",
      position: "Village Head",
      area: "Guruve",
      province: "Mashonaland Central",
      status: "National Review",
      submittedDate: "2023-08-10",
      progress: 75,
    },
    {
      id: "AP004",
      name: "Simba Mutasa",
      position: "Chief",
      area: "Buhera",
      province: "Manicaland",
      status: "Approved",
      submittedDate: "2023-05-20",
      completedDate: "2023-07-15",
    },
    {
      id: "AP005",
      name: "Farai Moyo",
      position: "Headman",
      area: "Hwedza",
      province: "Mashonaland East",
      status: "Rejected",
      submittedDate: "2023-04-10",
      completedDate: "2023-05-05",
      rejectionReason: "Incomplete documentation",
    },
    {
      id: "AP006",
      name: "Tatenda Shumba",
      position: "Village Head",
      area: "Lupane",
      province: "Matabeleland North",
      status: "Approved",
      submittedDate: "2023-03-15",
      completedDate: "2023-04-20",
    },
  ];

  // Pagination logic
  const totalItems = allAppointments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedAppointments = allAppointments.filter(appointment => {
    // Search filter
    const matchesSearch = appointment.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         appointment.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Position filter
    const matchesPosition = positionFilter === "all" || 
                          appointment.position.toLowerCase() === positionFilter.toLowerCase();
    
    // Date range filter
    const fromDate = dateRange?.from?.toISOString().split('T')[0];
    const toDate = dateRange?.to?.toISOString().split('T')[0];
    const matchesDate = (!fromDate || appointment.submittedDate >= fromDate) && 
                       (!toDate || appointment.submittedDate <= toDate);
    
    // Status filter based on active tab
    const matchesStatus = activeTab === "all" || 
                         (activeTab === "pending" && appointment.status !== "Approved" && appointment.status !== "Rejected") ||
                         (activeTab === "approved" && appointment.status === "Approved") ||
                         (activeTab === "rejected" && appointment.status === "Rejected");
    
    return matchesSearch && matchesPosition && matchesDate && matchesStatus;
  });

  const renderStatsCards = () => {
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New Appointments</CardDescription>
            <CardTitle className="text-2xl">{stats.newAppointments}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Approvals</CardDescription>
            <CardTitle className="text-2xl">{stats.pendingApprovals}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved This Month</CardDescription>
            <CardTitle className="text-2xl">{stats.approvedThisMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected This Month</CardDescription>
            <CardTitle className="text-2xl">{stats.rejectedThisMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderExportModal = () => {
    return (
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Appointments</DialogTitle>
            <DialogDescription>
              Select format and options for exporting appointment data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // In a real app, this would trigger the export
                setShowExportModal(false);
              }}>
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [appointmentType, setAppointmentType] = useState("chief");
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handlePreviousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderNewAppointmentForm = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">New Appointment Application</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-slate-100">
              Step {currentStep} of 4
            </Badge>
          </div>
        </div>

        <Progress value={currentStep * 25} className="h-2" />

        {currentStep === 1 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Position Details</CardTitle>
              <CardDescription>
                Select the type of traditional leadership position and provide basic details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="position-type">Position Type</Label>
                <Select
                  value={appointmentType}
                  onValueChange={setAppointmentType}
                >
                  <SelectTrigger id="position-type">
                    <SelectValue placeholder="Select position type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chief">Chief</SelectItem>
                    <SelectItem value="headman">Headman</SelectItem>
                    <SelectItem value="village-head">Village Head</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction/Area</Label>
                <Input id="jurisdiction" placeholder="Enter area of jurisdiction" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Select>
                    <SelectTrigger id="province">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manicaland">Manicaland</SelectItem>
                      <SelectItem value="mashonaland-central">Mashonaland Central</SelectItem>
                      <SelectItem value="mashonaland-east">Mashonaland East</SelectItem>
                      <SelectItem value="mashonaland-west">Mashonaland West</SelectItem>
                      <SelectItem value="masvingo">Masvingo</SelectItem>
                      <SelectItem value="matabeleland-north">Matabeleland North</SelectItem>
                      <SelectItem value="matabeleland-south">Matabeleland South</SelectItem>
                      <SelectItem value="midlands">Midlands</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input id="district" placeholder="Enter district" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNextStep}>Next Step</Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Nominee Information</CardTitle>
              <CardDescription>
                Provide details about the nominee for the {appointmentType === "chief" ? "Chief" : 
                appointmentType === "headman" ? "Headman" : "Village Head"} position.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Enter last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id-number">National ID Number</Label>
                <Input id="id-number" placeholder="Enter national ID number" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-of-birth">Date of Birth</Label>
                <Input id="date-of-birth" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lineage">Lineage/Family Line</Label>
                <Textarea
                  id="lineage"
                  placeholder="Describe the nominee's lineage and claim to the position"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                Previous
              </Button>
              <Button onClick={handleNextStep}>Next Step</Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
              <CardDescription>
                Upload all required documents to support the appointment application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>National ID Document</span>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Lineage Confirmation Letter</span>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Community Endorsement</span>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                </div>

                {appointmentType === "chief" && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span>Provincial Council Recommendation</span>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-notes">Additional Notes</Label>
                <Textarea
                  id="additional-notes"
                  placeholder="Any additional information to support the application"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                Previous
              </Button>
              <Button onClick={handleNextStep}>Next Step</Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Review all information before submitting the appointment application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Position Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Position Type:</span>
                      <p className="font-medium capitalize">
                        {appointmentType.replace("-", " ")}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Jurisdiction:</span>
                      <p className="font-medium">Mutasa</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Province:</span>
                      <p className="font-medium">Manicaland</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">District:</span>
                      <p className="font-medium">Mutasa</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Nominee Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Full Name:</span>
                      <p className="font-medium">Tafadzwa Moyo</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ID Number:</span>
                      <p className="font-medium">63-123456A78</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <p className="font-medium">15/05/1975</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Lineage:</span>
                    <p className="font-medium">
                      Descendant of Chief Mutasa III, through the Moyo family line.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Documents</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>National ID Document</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Lineage Confirmation Letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Community Endorsement</span>
                    </li>
                    {appointmentType === "chief" && (
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Provincial Council Recommendation</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Declaration</h4>
                    <p className="text-sm text-amber-700">
                      By submitting this application, you confirm that all
                      information provided is accurate and complete. False
                      information may result in rejection of the application and
                      possible legal consequences.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                Previous
              </Button>
              <Button>Submit Application</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  };

  const renderAppointmentsTable = () => {
    const filteredAppointments = allAppointments.filter(appointment => {
      // Search filter
      const matchesSearch = appointment.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appointment.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Position filter
      const matchesPosition = positionFilter === "all" || 
                            appointment.position.toLowerCase() === positionFilter.toLowerCase();
      
      // Date range filter
      const fromDate = dateRange?.from?.toISOString().split('T')[0];
      const toDate = dateRange?.to?.toISOString().split('T')[0];
      const matchesDate = (!fromDate || appointment.submittedDate >= fromDate) && 
                        (!toDate || appointment.submittedDate <= toDate);
      
      // Status filter based on active tab
      const matchesStatus = activeTab === "all" || 
                          (activeTab === "pending" && appointment.status !== "Approved" && appointment.status !== "Rejected") ||
                          (activeTab === "approved" && appointment.status === "Approved") ||
                          (activeTab === "rejected" && appointment.status === "Rejected");
      
      return matchesSearch && matchesPosition && matchesDate && matchesStatus;
    });

    const totalFilteredItems = filteredAppointments.length;
    const totalFilteredPages = Math.ceil(totalFilteredItems / pageSize);
    const paginatedAppointments = filteredAppointments.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => {
              setShowNewAppointmentModal(true);
              setCurrentStep(1);
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Appointment</span>
          </Button>
          <div className="flex items-center space-x-4">
            <Input 
              placeholder="Search appointments..." 
              className="w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="chief">Chief</SelectItem>
                <SelectItem value="headman">Headman</SelectItem>
                <SelectItem value="village head">Village Head</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-[300px]">
              <DatePickerWithRange 
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>

        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.name}</TableCell>
                  <TableCell>{appointment.position}</TableCell>
                  <TableCell>{appointment.area}</TableCell>
                  <TableCell>{appointment.province}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === "Approved" ? "default" :
                        appointment.status === "Rejected" ? "destructive" : "secondary"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{appointment.submittedDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <span>View</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalFilteredItems)} of {totalFilteredItems} items
            </span>
            <Select 
              value={pageSize.toString()} 
              onValueChange={(value) => {
                setPageSize(value === "all" ? totalFilteredItems : parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="60">60</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="sm" disabled>
                  {currentPage} of {totalFilteredPages}
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalFilteredPages))}
                  disabled={currentPage === totalFilteredPages || totalFilteredPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl space-y-6">
      {renderStatsCards()}
      {renderAppointmentsTable()}
      {renderExportModal()}

      <Dialog open={showNewAppointmentModal} onOpenChange={setShowNewAppointmentModal}>
        <DialogContent className="max-w-4xl bg-white">
          {renderNewAppointmentForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentWorkflow;
