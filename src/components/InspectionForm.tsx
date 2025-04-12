
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import { saveInspection, InspectionType, Anomaly } from "@/utils/inspectionUtils";

// Define the validation schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Use case name must be at least 2 characters.",
  }),
  inspectionType: z.string({
    required_error: "Please select an inspection type.",
  }),
  anomalies: z.array(z.string()).nonempty({
    message: "Please select at least one anomaly to detect.",
  }),
});

// Define types
type FormValues = z.infer<typeof formSchema>;

const inspectionTypes = [
  { value: "visual", label: "Visual" },
  { value: "thermal", label: "Thermal" },
  { value: "acoustic", label: "Acoustic" },
  { value: "vibration", label: "Vibration" },
];

const anomalyOptions = [
  { id: "cracks", label: "Cracks" },
  { id: "hotspots", label: "Hotspots" },
  { id: "corrosion", label: "Corrosion" },
  { id: "leaks", label: "Leaks" },
  { id: "delamination", label: "Delamination" },
  { id: "wear", label: "Wear" },
];

interface InspectionFormProps {
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({ 
  onSuccess, 
  isOpen = true,
  onClose 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      inspectionType: "",
      anomalies: [],
    },
  });

  const handleClose = () => {
    setIsDialogOpen(false);
    if (onClose) onClose();
  };

  const onSubmit = (data: FormValues) => {
    try {
      // Save the inspection using our utility
      saveInspection({
        name: data.name,
        inspectionType: data.inspectionType as InspectionType,
        anomalies: data.anomalies as Anomaly[],
      });
      
      toast.success("Use case created successfully!");
      form.reset();
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving inspection:", error);
      toast.error("Failed to create use case. Please try again.");
    }
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Create New Use Case</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Use Case Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Wind Turbine Blade Inspection" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inspectionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspection Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inspection type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {inspectionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anomalies"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Target Anomalies</FormLabel>
                    </div>
                    <div className="border rounded-md p-3">
                      {anomalyOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="anomalies"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 py-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...field.value, option.id]
                                        : field.value.filter(
                                            (value) => value !== option.id
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-inspection-blue hover:bg-blue-700 text-white"
                >
                  Create Use Case
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
