import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SkillsManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: string;
    difficulty: "beginner" | "intermediate" | "advanced" | "expert";
    currentDemand: number;
  }>({
    name: "",
    description: "",
    category: "",
    difficulty: "intermediate",
    currentDemand: 50,
  });

  const skillsQuery = trpc.skills.list.useQuery();
  const createSkillMutation = trpc.skills.create.useMutation();
  const updateSkillMutation = trpc.skills.update.useMutation();

  const skills = skillsQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateSkillMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Skill updated successfully");
      } else {
        await createSkillMutation.mutateAsync(formData);
        toast.success("Skill created successfully");
      }

      setFormData({
        name: "",
        description: "",
        category: "",
        difficulty: "intermediate",
        currentDemand: 50,
      });
      setEditingId(null);
      setIsOpen(false);
      skillsQuery.refetch();
    } catch (error) {
      toast.error("Failed to save skill");
    }
  };

  const handleEdit = (skill: typeof skills[0]) => {
    setFormData({
      name: skill.name,
      description: skill.description || "",
      category: skill.category || "",
      difficulty: skill.difficulty || "intermediate",
      currentDemand: skill.currentDemand || 50,
    });
    setEditingId(skill.id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      difficulty: "intermediate",
      currentDemand: 50,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills Management</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleClose()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Skill" : "Create New Skill"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the skill details" : "Add a new skill to the system"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Python, React, Kubernetes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the skill..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Programming, DevOps"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value: "beginner" | "intermediate" | "advanced" | "expert") => setFormData({ ...formData, difficulty: value })}>
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demand">Current Demand (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="demand"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.currentDemand}
                    onChange={(e) => setFormData({ ...formData, currentDemand: parseInt(e.target.value) })}
                  />
                  <span className="text-sm text-muted-foreground">{formData.currentDemand}%</span>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Update Skill" : "Create Skill"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Demand</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map(skill => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>{skill.category || "-"}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {skill.difficulty}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.currentDemand}%` }}
                      />
                    </div>
                    <span className="text-sm">{skill.currentDemand}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    skill.demandTrend === "increasing" ? "bg-green-100 text-green-800" :
                    skill.demandTrend === "decreasing" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {skill.demandTrend}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(skill)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
