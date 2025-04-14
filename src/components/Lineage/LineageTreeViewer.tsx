import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Search,
  ZoomIn,
  ZoomOut,
  PanelLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  User,
  Calendar,
  MapPin,
} from "lucide-react";

interface LeaderNode {
  id: string;
  name: string;
  title: string;
  appointmentDate: string;
  endDate?: string;
  imageUrl: string;
  jurisdiction: string;
  children?: LeaderNode[];
  parent?: string;
}

interface LineageTreeViewerProps {
  initialLeader?: LeaderNode;
  lineageData?: LeaderNode[];
}

const defaultLeader: LeaderNode = {
  id: "chief-1",
  name: "Mutasa Nyakurukwa",
  title: "Chief",
  appointmentDate: "1995-06-15",
  imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=chief1",
  jurisdiction: "Mutasa District, Manicaland Province",
  children: [
    {
      id: "headman-1",
      name: "Tendai Shumba",
      title: "Headman",
      appointmentDate: "2005-03-22",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=headman1",
      jurisdiction: "Shumba Village, Mutasa District",
      parent: "chief-1",
      children: [
        {
          id: "village-head-1",
          name: "Farai Moyo",
          title: "Village Head",
          appointmentDate: "2010-11-05",
          imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=village1",
          jurisdiction: "Moyo Village",
          parent: "headman-1",
        },
        {
          id: "village-head-2",
          name: "Grace Ncube",
          title: "Village Head",
          appointmentDate: "2012-07-18",
          imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=village2",
          jurisdiction: "Ncube Village",
          parent: "headman-1",
        },
      ],
    },
    {
      id: "headman-2",
      name: "Simba Muponda",
      title: "Headman",
      appointmentDate: "2008-09-10",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=headman2",
      jurisdiction: "Muponda Area, Mutasa District",
      parent: "chief-1",
      children: [
        {
          id: "village-head-3",
          name: "Tatenda Dube",
          title: "Village Head",
          appointmentDate: "2015-04-30",
          imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=village3",
          jurisdiction: "Dube Village",
          parent: "headman-2",
        },
      ],
    },
  ],
};

const defaultLineageData: LeaderNode[] = [
  {
    id: "ancestor-1",
    name: "Mutasa I",
    title: "Chief",
    appointmentDate: "1890-01-01",
    endDate: "1920-05-12",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ancestor1",
    jurisdiction: "Mutasa Territory",
  },
  {
    id: "ancestor-2",
    name: "Mutasa II",
    title: "Chief",
    appointmentDate: "1920-06-01",
    endDate: "1945-11-23",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ancestor2",
    jurisdiction: "Mutasa Territory",
  },
  {
    id: "ancestor-3",
    name: "Mutasa III",
    title: "Chief",
    appointmentDate: "1946-01-15",
    endDate: "1980-08-05",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ancestor3",
    jurisdiction: "Mutasa District",
  },
  {
    id: "ancestor-4",
    name: "Mutasa IV",
    title: "Chief",
    appointmentDate: "1980-10-20",
    endDate: "1995-05-30",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ancestor4",
    jurisdiction: "Mutasa District, Manicaland Province",
  },
  defaultLeader,
];

const LineageTreeViewer: React.FC<LineageTreeViewerProps> = ({
  initialLeader = defaultLeader,
  lineageData = defaultLineageData,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<string>("hierarchy");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLeader, setSelectedLeader] = useState<LeaderNode | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [chieftainshipFilter, setChieftainshipFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const handleLeaderClick = (leader: LeaderNode) => {
    setSelectedLeader(leader);
  };

  const filterLeader = (leader: LeaderNode, filterByRole: boolean = false): boolean => {
    const matchesChieftainship = chieftainshipFilter === "all" || 
      leader.jurisdiction.startsWith(chieftainshipFilter);
      
    if (filterByRole) {
      const matchesRole = roleFilter === "all" || 
        leader.title.toLowerCase().includes(roleFilter);
      return matchesChieftainship && matchesRole;
    }
    return matchesChieftainship;
  };

  const filterLeaderNode = (node: LeaderNode): LeaderNode => {
    // For hierarchy view, we always show the full structure of the selected chieftainship
    const matchesChieftainship = chieftainshipFilter === "all" || 
      node.jurisdiction.startsWith(chieftainshipFilter);
      
    if (!matchesChieftainship || !node.children || node.children.length === 0) {
      return node;
    }
    
    return {
      ...node,
      children: node.children.map(filterLeaderNode)
    };
  };

  const renderLeaderNode = (leader: LeaderNode, level: number = 0) => {
    const nodeVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: level * 0.1,
          duration: 0.3,
        },
      },
    };

    return (
      <motion.div
        key={leader.id}
        className="flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={nodeVariants}
      >
        <div
          className={`relative p-4 mb-2 rounded-lg cursor-pointer transition-all ${selectedLeader?.id === leader.id ? "ring-2 ring-primary" : "hover:bg-accent"}`}
          onClick={() => handleLeaderClick(leader)}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-primary">
              <img
                src={leader.imageUrl}
                alt={leader.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-sm">{leader.name}</h4>
              <p className="text-xs text-muted-foreground">{leader.title}</p>
            </div>
          </div>
        </div>

        {leader.children && leader.children.length > 0 && (
          <div className="relative">
            <div className="absolute left-1/2 top-0 w-0.5 h-8 bg-border -translate-x-1/2"></div>
            <div className="pt-8">
              <div className="flex flex-wrap justify-center gap-8">
                {leader.children.map((child) =>
                  renderLeaderNode(child, level + 1),
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderTimelineView = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const leadersPerPage = 5;
    const filteredLeaders = lineageData.filter(leader => filterLeader(leader, true));
    const totalPages = Math.ceil(filteredLeaders.length / leadersPerPage);
    const paginatedLeaders = filteredLeaders.slice(
      currentPage * leadersPerPage,
      (currentPage + 1) * leadersPerPage
    );

    return (
      <div className="relative mt-8 pl-8 border-l-2 border-primary/30">
        {paginatedLeaders.map((leader, index) => (
          <motion.div
            key={leader.id}
            className="mb-8 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="absolute -left-10 top-0 w-4 h-4 rounded-full bg-primary"></div>
            <div
              className={`p-4 rounded-lg border cursor-pointer ${selectedLeader?.id === leader.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}
              onClick={() => handleLeaderClick(leader)}
            >
              <h3 className="font-semibold text-base">{leader.name}</h3>
              <p className="text-sm text-muted-foreground">{leader.title}</p>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                <span>
                  {leader.appointmentDate}{" "}
                  {leader.endDate ? `- ${leader.endDate}` : "(Current)"}
                </span>
              </div>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{leader.jurisdiction}</span>
              </div>
            </div>
          </motion.div>
        ))}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <span className="flex items-center text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Lineage Tree Viewer</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leaders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select 
                value={chieftainshipFilter}
                onValueChange={setChieftainshipFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chieftainship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chieftainships</SelectItem>
                  {Array.from(new Set(lineageData.map(l => l.jurisdiction.split(',')[0])))
                    .map(chieftainship => (
                      <SelectItem key={chieftainship} value={chieftainship}>
                        {chieftainship}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select 
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="chief">Chiefs</SelectItem>
                  <SelectItem value="headman">Headmen</SelectItem>
                  <SelectItem value="village">Village Heads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>
            <TabsContent value="hierarchy" className="p-4 border rounded-lg">
              <div
                className="min-h-[500px] overflow-auto p-4 flex justify-center"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                }}
              >
                {renderLeaderNode(filterLeaderNode(initialLeader))}
              </div>
            </TabsContent>
            <TabsContent value="timeline" className="p-4 border rounded-lg">
              <div className="min-h-[500px] overflow-auto p-4">
                {renderTimelineView()}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-center gap-2 mt-4 border-t pt-4">
            <ZoomOut className="h-4 w-4" />
            <Slider
              value={[zoom]}
              min={50}
              max={150}
              step={5}
              onValueChange={handleZoomChange}
              className="w-48"
            />
            <ZoomIn className="h-4 w-4" />
            <span className="text-sm text-muted-foreground ml-2">{zoom}%</span>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`border-l transition-all duration-300 ${showSidebar ? "w-80" : "w-10"}`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-none"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {showSidebar && selectedLeader && (
            <div className="p-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                      <img
                        src={selectedLeader.imageUrl}
                        alt={selectedLeader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-center">
                    {selectedLeader.name}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {selectedLeader.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Appointment
                      </h4>
                      <p className="text-sm">
                        {selectedLeader.appointmentDate}
                      </p>
                      {selectedLeader.endDate && (
                        <p className="text-sm text-muted-foreground">
                          End: {selectedLeader.endDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Jurisdiction
                      </h4>
                      <p className="text-sm">{selectedLeader.jurisdiction}</p>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        View Full Profile
                      </Button>
                    </div>
                    {activeTab === "hierarchy" && (
                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          Trace Ancestry
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {showSidebar && !selectedLeader && (
            <div className="p-4 flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2" />
                <p>Select a leader to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineageTreeViewer;
