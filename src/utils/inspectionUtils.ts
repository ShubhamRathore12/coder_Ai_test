
export type InspectionType = 'visual' | 'thermal' | 'acoustic' | 'vibration';

export type Anomaly = 'cracks' | 'hotspots' | 'corrosion' | 'leaks' | 'delamination' | 'wear';

export interface InspectionUseCase {
  id: string;
  name: string;
  inspectionType: InspectionType;
  anomalies: Anomaly[];
  createdAt: Date;
}

// Generate a unique ID for new inspection use cases
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Save inspection to local storage
export const saveInspection = (inspection: Omit<InspectionUseCase, 'id' | 'createdAt'>): InspectionUseCase => {
  const newInspection: InspectionUseCase = {
    ...inspection,
    id: generateId(),
    createdAt: new Date(),
  };

  // Get existing inspections or initialize empty array
  const existingInspections = getInspections();
  
  // Add new inspection
  const updatedInspections = [...existingInspections, newInspection];
  
  // Save to localStorage
  localStorage.setItem('inspectionUseCases', JSON.stringify(updatedInspections));
  
  return newInspection;
};

// Get all inspections from local storage
export const getInspections = (): InspectionUseCase[] => {
  const inspectionsJson = localStorage.getItem('inspectionUseCases');
  if (!inspectionsJson) return [];
  
  try {
    return JSON.parse(inspectionsJson);
  } catch (error) {
    console.error('Failed to parse inspections from localStorage:', error);
    return [];
  }
};

// Delete an inspection by ID
export const deleteInspection = (id: string): boolean => {
  const inspections = getInspections();
  const updatedInspections = inspections.filter(inspection => inspection.id !== id);
  
  if (updatedInspections.length < inspections.length) {
    localStorage.setItem('inspectionUseCases', JSON.stringify(updatedInspections));
    return true;
  }
  
  return false;
};
