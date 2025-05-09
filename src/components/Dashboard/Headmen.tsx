import React, { useState, useEffect } from "react";
// Change this line
import { HeadmanDetailsModal } from "./HeadmanDetailsModal";
import { HeadmanEditModal } from "./HeadmanEditModal";
import { TraditionalLeader } from "@/lib/types";
import { getHeadmen } from "@/lib/apiService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Snackbar } from "@/components/ui/snackbar";

const Headmen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedHeadman, setSelectedHeadman] =
    useState<TraditionalLeader | null>(null);
  const [editingHeadman, setEditingHeadman] =
    useState<TraditionalLeader | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    variant: "default" as "default" | "success" | "error",
  });

  const [allHeadmen, setAllHeadmen] = useState<TraditionalLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeadmen = async () => {
      try {
        const data = await getHeadmen();
        setAllHeadmen(data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch headmen"
        );
        setLoading(false);
      }
    };

    fetchHeadmen();
  }, []);

  const showMessage = (message: string, variant: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      variant,
    });
  };

  const refreshHeadmen = async () => {
    try {
      const data = await getHeadmen(
        provinceFilter === "all" ? undefined : provinceFilter
      );
      setAllHeadmen(data);
    } catch (error) {
      console.error("Error refreshing headmen:", error);
    }
  };

  // Stats calculation
  const activeHeadmen = allHeadmen.filter(
    (h) => h.status && h.status.toLowerCase() === "active"
  ).length;
  const inactiveHeadmen = allHeadmen.filter(
    (h) => !h.status || h.status.toLowerCase() !== "active"
  ).length;
  const provinces = [...new Set(allHeadmen.map((h) => h.province))];

  // Filter headmen
  const filteredHeadmen = allHeadmen.filter((headman) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (headman.incumbent?.toLowerCase().includes(searchLower) ?? false) ||
      (headman.headmanship?.toLowerCase().includes(searchLower) ?? false);

    const matchesProvince =
      provinceFilter === "all" ||
      headman.province?.toLowerCase() === provinceFilter.toLowerCase();

    return matchesSearch && matchesProvince;
  });

  // Pagination logic
  const totalItems = filteredHeadmen.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedHeadmen = filteredHeadmen.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderExportModal = () => {
    return (
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Headmen</DialogTitle>
            <DialogDescription>
              Select format and options for exporting headmen data
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
              <Button
                variant="outline"
                onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
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

  const renderStatsCards = () => {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Headmen</CardDescription>
            <CardTitle className="text-2xl">{allHeadmen.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Headmen</CardDescription>
            <CardTitle className="text-2xl">{activeHeadmen}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive Headmen</CardDescription>
            <CardTitle className="text-2xl">{inactiveHeadmen}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderStatsCards()}
      {selectedHeadman && (
        <HeadmanDetailsModal
          headman={{
            ...selectedHeadman,
            id: selectedHeadman?.id || 0,
          }}
          isOpen={!!selectedHeadman}
          onClose={() => setSelectedHeadman(null)}
        />
      )}
      {editingHeadman && (
        <HeadmanEditModal
          headman={editingHeadman}
          isOpen={!!editingHeadman}
          onClose={() => setEditingHeadman(null)}
          onUpdate={refreshHeadmen}
          onShowMessage={showMessage}
        />
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
          <CardTitle>Headmen</CardTitle>
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </CardHeader>
        <CardHeader className="pt-0 px-6 pb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search headmen..."
              className="w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={provinceFilter} onValueChange={setProvinceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province.toLowerCase()}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Headmanship</TableHead>
                <TableHead>Chieftainship</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Date of Appointment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHeadmen.map((headman, i) => (
                <TableRow key={i}>
                  <TableCell>{headman.incumbent || "-"}</TableCell>
                  <TableCell>{headman.headmanship || "-"}</TableCell>
                  <TableCell>{headman.chieftainship || "-"}</TableCell>
                  <TableCell>{headman.province || "-"}</TableCell>
                  <TableCell>{headman.district || "-"}</TableCell>
                  <TableCell>{headman.dateofappointment || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        headman.status?.toLowerCase() === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {headman.status || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedHeadman(headman)}>
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingHeadman(headman)}>
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
              items
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(value === "all" ? totalItems : parseInt(value));
                setCurrentPage(1);
              }}>
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="sm" disabled>
                  {currentPage} of {totalPages}
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
      {renderExportModal()}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        duration={3000}
      />
    </div>
  );
};

export default Headmen;
