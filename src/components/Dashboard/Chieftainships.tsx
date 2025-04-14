import React, { useState, useEffect } from "react";
import { getChieftainships } from "../../lib/apiService";
import { TraditionalArea } from "../../lib/types";
import { ChiefDetailsModal } from "./ChiefDetailsModal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
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
import { CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Chief } from "@/types/supabase";

const Chieftainships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedChief, setSelectedChief] = useState<Chief | null>(null);

  const [allChieftainships, setAllChieftainships] = useState<
    (TraditionalArea & { name?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChieftainships = async () => {
      try {
        const data = await getChieftainships();
        setAllChieftainships(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load chieftainships"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChieftainships();
  }, []);

  if (loading) return <div>Loading chieftainships...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Stats calculation
  const activeChieftainships = allChieftainships.filter(
    (c) => c.status && c.status === "Active"
  ).length;
  const inactiveChieftainships = allChieftainships.filter(
    (c) => !c.status || c.status !== "Active"
  ).length;
  const provinces = [...new Set(allChieftainships.map((c) => c.province))];

  // Filter chieftainships
  const filteredChieftainships = allChieftainships.filter((chieftanship) => {
    const name = chieftanship.name || chieftanship.chieftainship || "";
    const province = chieftanship.province || "";

    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesProvince =
      provinceFilter === "all" ||
      province.toLowerCase() === provinceFilter.toLowerCase();

    return matchesSearch && matchesProvince;
  });

  // Pagination logic
  const totalItems = filteredChieftainships.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedChieftainships = filteredChieftainships.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderExportModal = () => {
    return (
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Chieftainships</DialogTitle>
            <DialogDescription>
              Select format and options for exporting chieftanship data
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
            <CardDescription>Total Chieftainships</CardDescription>
            <CardTitle className="text-2xl">
              {allChieftainships.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Chieftainships</CardDescription>
            <CardTitle className="text-2xl">{activeChieftainships}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive Chieftainships</CardDescription>
            <CardTitle className="text-2xl">{inactiveChieftainships}</CardTitle>
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
      <ChiefDetailsModal
        chief={selectedChief}
        isOpen={!!selectedChief}
        onClose={() => setSelectedChief(null)}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
          <CardTitle>Chieftainships</CardTitle>
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
              placeholder="Search chieftainships..."
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
                <TableHead>Province</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedChieftainships.map((chieftanship, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {chieftanship.name || chieftanship.chieftainship || "N/A"}
                  </TableCell>
                  <TableCell>{chieftanship.province}</TableCell>
                  <TableCell>{chieftanship.district}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        chieftanship.status &&
                        chieftanship.status === "Substantive"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {chieftanship.status || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const chiefData = chieftanship as unknown as Chief;
                        if (chiefData.title && chiefData.date_of_birth) {
                          setSelectedChief(chiefData);
                        }
                      }}>
                      View Details
                    </Button>
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

export default Chieftainships;
