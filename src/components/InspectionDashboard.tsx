
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { InspectionForm } from "@/components/InspectionForm";
import { InspectionUseCase, getInspections, deleteInspection } from "@/utils/inspectionUtils";
import { toast } from "sonner";

export const InspectionDashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [inspections, setInspections] = useState<InspectionUseCase[]>([]);

  // Load inspections from local storage on component mount
  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = () => {
    const loadedInspections = getInspections();
    setInspections(loadedInspections);
  };

  const handleCreateSuccess = () => {
    setShowForm(false);
    loadInspections();
  };

  const handleDelete = (id: string) => {
    if (deleteInspection(id)) {
      toast.success("Inspection use case deleted successfully");
      loadInspections();
    } else {
      toast.error("Failed to delete inspection use case");
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inspection Use Cases</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-inspection-blue hover:bg-blue-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          New Use Case
        </Button>
      </div>

      {/* Show inspection form modal when needed */}
      {showForm && (
        <InspectionForm 
          isOpen={true}
          onClose={() => setShowForm(false)}
          onSuccess={handleCreateSuccess} 
        />
      )}

      {/* Display list of inspection use cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspections.length === 0 ? (
          <div className="col-span-full text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No inspection use cases found. Create one to get started.</p>
          </div>
        ) : (
          inspections.map((inspection) => (
            <Card key={inspection.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg">{inspection.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Inspection Type</p>
                    <p className="capitalize">{inspection.inspectionType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Target Anomalies</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {inspection.anomalies.map((anomaly) => (
                        <span 
                          key={anomaly} 
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize"
                        >
                          {anomaly}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created At</p>
                    <p className="text-sm">{formatDate(inspection.createdAt)}</p>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs text-red-600 hover:text-red-700" 
                      onClick={() => handleDelete(inspection.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
