import React, { useState, useEffect } from "react";
import { VillageHeadsDetailsModal } from "./VillageHeadsDetailsModal";
import { VillageHeadEditModal } from "./VillageHeadEditModal";
import { TraditionalLeader } from "../../lib/types";
import { getVillageHeads } from "../../lib/apiService";
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

const VillageHeads = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedVillageHead, setSelectedVillageHead] =
    useState<TraditionalLeader | null>(null);
  const [allVillageHeads, setAllVillageHeads] = useState<TraditionalLeader[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVillageHead, setEditingVillageHead] =
    useState<TraditionalLeader | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    variant: "default" as "default" | "success" | "error",
  });

  const showMessage = (message: string, variant: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      variant,
    });
  };

  useEffect(() => {
    const fetchVillageHeads = async () => {
      try {
        const data = await getVillageHeads();
        console.log("Fetched data:", data); // Debug log
        setAllVillageHeads(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching village heads:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load village heads"
        );
        setLoading(false);
      }
    };

    fetchVillageHeads();
  }, []);

  const renderStatsCards = () => {
    const activeVillageHeads = allVillageHeads.filter(
      (vh) => vh?.status?.toLowerCase() === "active"
    ).length;
    const inactiveVillageHeads = allVillageHeads.filter(
      (vh) => vh?.status?.toLowerCase() !== "active"
    ).length;

    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Village Heads</CardDescription>
            <CardTitle className="text-2xl">{allVillageHeads.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Village Heads</CardDescription>
            <CardTitle className="text-2xl">{activeVillageHeads}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive Village Heads</CardDescription>
            <CardTitle className="text-2xl">{inactiveVillageHeads}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
      </div>
    );
  };

  const filteredVillageHeads = allVillageHeads.filter((villageHead) => {
    if (!villageHead) return false;

    const name = villageHead.incumbent?.toLowerCase() || "";
    const village = villageHead.villageship?.toLowerCase() || "";
    const province = villageHead.province?.toLowerCase() || "";

    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      village.includes(searchQuery.toLowerCase());
    const matchesProvince =
      provinceFilter === "all" || province === provinceFilter.toLowerCase();
    return matchesSearch && matchesProvince;
  });

  const provinces = [
    ...new Set(
      allVillageHeads.filter((vh) => vh && vh.province).map((vh) => vh.province)
    ),
  ];

  const totalItems = filteredVillageHeads.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedVillageHeads = filteredVillageHeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderExportModal = () => {
    return (
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Village Heads</DialogTitle>
            <DialogDescription>
              Select format and options for exporting village heads data
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading village heads...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const refreshVillageHeads = async () => {
    try {
      const data = await getVillageHeads();
      setAllVillageHeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error refreshing village heads:", error);
      showMessage("Failed to refresh village heads", "error");
    }
  };

  return (
    <div className="space-y-6">
      {renderStatsCards()}
      <VillageHeadsDetailsModal
        villageHead={selectedVillageHead}
        isOpen={!!selectedVillageHead}
        onClose={() => setSelectedVillageHead(null)}
      />

      {editingVillageHead && (
        <VillageHeadEditModal
          villageHead={editingVillageHead}
          isOpen={!!editingVillageHead}
          onClose={() => setEditingVillageHead(null)}
          onUpdate={refreshVillageHeads}
          onShowMessage={showMessage}
        />
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
          <CardTitle>Village Heads</CardTitle>
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
              placeholder="Search village heads..."
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
                <TableHead>Chieftainship</TableHead>
                <TableHead>Headman</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVillageHeads.map((villageHead, i) => (
                <TableRow key={i}>
                  <TableCell>{villageHead.incumbent || "-"}</TableCell>
                  <TableCell>{villageHead.chieftainship || "-"}</TableCell>
                  <TableCell>{villageHead.headmanship || "-"}</TableCell>
                  <TableCell>{villageHead.province || "-"}</TableCell>
                  <TableCell>{villageHead.district || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        villageHead.status?.toLowerCase() === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {villageHead.status || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVillageHead(villageHead)}>
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingVillageHead(villageHead)}>
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
    </div>
  );
};

export default VillageHeads;
