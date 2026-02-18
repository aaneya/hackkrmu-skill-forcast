import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function ForecastsManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<{
    skillId: string;
    forecastDate: string;
    predictedDemand: number;
    confidence: number;
    trend: "increasing" | "decreasing" | "stable";
    notes: string;
  }>({
    skillId: "",
    forecastDate: new Date().toISOString().split("T")[0],
    predictedDemand: 50,
    confidence: 75,
    trend: "stable",
    notes: "",
  });

  const skillsQuery = trpc.skills.list.useQuery();
  const forecastsQuery = trpc.forecasts.getRecent.useQuery({ days: 30 });
  const createForecastMutation = trpc.forecasts.create.useMutation();

  const skills = skillsQuery.data || [];
  const forecasts = forecastsQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.skillId) {
      toast.error("Please select a skill");
      return;
    }

    try {
      await createForecastMutation.mutateAsync({
        skillId: parseInt(formData.skillId),
        forecastDate: new Date(formData.forecastDate),
        predictedDemand: formData.predictedDemand,
        confidence: formData.confidence,
        trend: formData.trend,
        notes: formData.notes,
      });

      toast.success("Forecast created successfully");
      setFormData({
        skillId: "",
        forecastDate: new Date().toISOString().split("T")[0],
        predictedDemand: 50,
        confidence: 75,
        trend: "stable",
        notes: "",
      });
      setIsOpen(false);
      forecastsQuery.refetch();
    } catch (error) {
      toast.error("Failed to create forecast");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Forecasts Management</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Forecast
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Forecast</DialogTitle>
              <DialogDescription>
                Add a new forecast for a skill
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skill">Skill</Label>
                <Select value={formData.skillId} onValueChange={(value) => setFormData({ ...formData, skillId: value })}>
                  <SelectTrigger id="skill">
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map(skill => (
                      <SelectItem key={skill.id} value={skill.id.toString()}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Forecast Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.forecastDate}
                  onChange={(e) => setFormData({ ...formData, forecastDate: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="demand">Predicted Demand (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="demand"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.predictedDemand}
                      onChange={(e) => setFormData({ ...formData, predictedDemand: parseInt(e.target.value) })}
                    />
                    <span className="text-sm text-muted-foreground">{formData.predictedDemand}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confidence">Confidence (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="confidence"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.confidence}
                      onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
                    />
                    <span className="text-sm text-muted-foreground">{formData.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trend">Trend</Label>
                <Select value={formData.trend} onValueChange={(value: any) => setFormData({ ...formData, trend: value })}>
                  <SelectTrigger id="trend">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increasing">Increasing</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="decreasing">Decreasing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes about this forecast..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Create Forecast
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Forecast Date</TableHead>
              <TableHead>Predicted Demand</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forecasts.slice(0, 10).map(forecast => (
              <TableRow key={forecast.id}>
                <TableCell className="font-medium">Skill #{forecast.skillId}</TableCell>
                <TableCell>{new Date(forecast.forecastDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${forecast.predictedDemand}%` }}
                      />
                    </div>
                    <span className="text-sm">{forecast.predictedDemand}%</span>
                  </div>
                </TableCell>
                <TableCell>{parseFloat(forecast.confidence as any).toFixed(1)}%</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    forecast.trend === "increasing" ? "bg-green-100 text-green-800" :
                    forecast.trend === "decreasing" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {forecast.trend}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
