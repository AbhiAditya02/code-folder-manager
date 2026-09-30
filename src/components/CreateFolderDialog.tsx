"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getYearString } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export function CreateFolderDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    dept: "",
    year: "1",
    batch: "",
    groupName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dept: formData.dept.toUpperCase(),
          year: parseInt(formData.year),
          batch: formData.batch.toUpperCase(),
          groupName: formData.groupName.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create folder");
      }

      setOpen(false);
      setFormData({ dept: "", year: "1", batch: "", groupName: "" });
      toast.add({ title: "Success", description: "Folder created successfully.", type: "success" });
      router.refresh(); // Refresh page to see new folder
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="group relative overflow-hidden rounded-full bg-primary px-6 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(var(--primary),0.5)]" />
        }
      >
        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[100%] transition-transform duration-700 group-hover:translate-x-[100%]" />
        <Plus className="mr-2 h-4 w-4" />
        New Folder
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 border-border/50 bg-background/80 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">Create new folder</DialogTitle>
          <DialogDescription>
            Enter the details for your new code folder. It will be named automatically based on your inputs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dept">Department</Label>
              <Input
                id="dept"
                placeholder="e.g. CSE"
                required
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                className="uppercase bg-black/50 border-border/50 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select 
                value={formData.year} 
                onValueChange={(val) => setFormData({ ...formData, year: val || "" })}
              >
                <SelectTrigger id="year" className="bg-black/50 border-border/50 focus-visible:ring-primary/50">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-border/50 backdrop-blur-xl">
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                placeholder="e.g. B1"
                required
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="uppercase bg-black/50 border-border/50 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupName">Group</Label>
              <Input
                id="groupName"
                placeholder="e.g. G3"
                required
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                className="uppercase bg-black/50 border-border/50 focus-visible:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="rounded-lg bg-primary/10 p-3 mt-4 border border-primary/20">
            <p className="text-sm text-center font-mono text-primary">
              Folder name: {formData.dept || 'DEPT'}_{getYearString(formData.year)}_{formData.batch || 'BATCH'}_{formData.groupName || 'GROUP'}
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-border/50 bg-transparent hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.3)]">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
