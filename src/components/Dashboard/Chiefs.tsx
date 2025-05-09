import React, { useState, useEffect, useCallback } from "react";
import { getChiefs } from "../../lib/apiService";
import { TraditionalLeader } from "../../lib/types";
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
import ChiefsDetailsModal from "@/components/Dashboard/ChiefsDetailsModal";
import { ChiefEditModal } from "@/components/Dashboard/ChiefEditModal";
import { Snackbar } from "@/components/ui/snackbar";

const Chiefs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedChief, setSelectedChief] = useState<TraditionalLeader | null>(
    null
  );
  const [editingChief, setEditingChief] = useState<TraditionalLeader | null>(
    null
  );

  const [allChiefs, setAllChiefs] = useState<TraditionalLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    variant: "default" as "default" | "success" | "error",
  });

  // Add function to show messages
  const showMessage = (message: string, variant: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      variant,
    });
  };

  const refreshChiefs = useCallback(async () => {
    try {
      const data = await getChiefs(
        provinceFilter === "all" ? undefined : provinceFilter
      );
      setAllChiefs(data);
    } catch (error) {
      console.error("Error refreshing chiefs:", error);
    }
  }, [provinceFilter]);

  useEffect(() => {
    const fetchChiefs = async () => {
      try {
        const data = await getChiefs();
        console.log("Fetched chiefs:", data); // Debugging line
        setAllChiefs(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chiefs");
      } finally {
        setLoading(false);
      }
    };

    fetchChiefs();
  }, []);

  // Stats calculation
  const activeChiefs = allChiefs.filter(
    (h) => h.status && h.status.toLowerCase() === "active"
  ).length;
  const inactiveChiefs = allChiefs.filter(
    (h) => !h.status || h.status.toLowerCase() !== "active"
  ).length;
  const provinces = [...new Set(allChiefs.map((h) => h.province))];

  if (loading) return <div>Loading chiefs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Filter chiefs
  const filteredChiefs = allChiefs.filter((chief) => {
    if (!chief) return false; // Skip undefined/null chiefs

    const name = chief?.chieftainship ?? "";
    const province = chief?.province ?? "";

    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesProvince =
      provinceFilter === "all" ||
      province.toLowerCase() === provinceFilter.toLowerCase();

    return matchesSearch && matchesProvince;
  });

  // Pagination logic
  const totalItems = filteredChiefs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedChiefs = filteredChiefs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderExportModal = () => {
    return (
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Chiefs</DialogTitle>
            <DialogDescription>
              Select format and options for exporting chiefs data
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
            <CardDescription>Total Chiefs</CardDescription>
            <CardTitle className="text-2xl">{allChiefs.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Chiefs</CardDescription>
            <CardTitle className="text-2xl">{activeChiefs}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive Chiefs</CardDescription>
            <CardTitle className="text-2xl">{inactiveChiefs}</CardTitle>
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
      {selectedChief && (
        <ChiefsDetailsModal
          chief={{
            ...selectedChief,
            id: selectedChief?.id || 0,
          }}
          isOpen={!!selectedChief}
          onClose={() => setSelectedChief(null)}
        />
      )}
      {editingChief && (
        <ChiefEditModal
          chief={editingChief}
          isOpen={!!editingChief}
          onClose={() => setEditingChief(null)}
          onUpdate={refreshChiefs}
          onShowMessage={showMessage}
        />
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
          <CardTitle>Chiefs</CardTitle>
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
              placeholder="Search chiefs..."
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
                {[
                  ...new Set(
                    allChiefs
                      .filter((c) => c && c.province) // Filter out null/undefined chiefs and provinces
                      .map((c) => c.province)
                  ),
                ].map((province) => (
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
                <TableHead>Chieftainship</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Date of Appointment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedChiefs.map((chief, i) => (
                <TableRow key={i}>
                  <TableCell>{chief.incumbent || "-"}</TableCell>
                  <TableCell>{chief.chieftainship || "-"}</TableCell>
                  <TableCell>{chief.province || "-"}</TableCell>
                  <TableCell>{chief.district || "-"}</TableCell>
                  <TableCell>{chief.dateofappointment || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        chief.status?.toLowerCase() === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {chief.status || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedChief(chief)}>
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingChief(chief)}>
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
      {/* Add Snackbar at the root level */}
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

export default Chiefs;
