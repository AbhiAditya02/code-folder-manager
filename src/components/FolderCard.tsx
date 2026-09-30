import Link from "next/link";
import { Folder, Calendar, Users, GraduationCap, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getYearString } from "@/lib/utils";

interface FolderCardProps {
  id: string;
  name: string;
  dept: string;
  year: number;
  batch: string;
  groupName: string;
  createdAt: Date;
}

export function FolderCard({ id, name, dept, year, batch, groupName, createdAt }: FolderCardProps) {
  return (
    <Link href={`/folders/${id}`}>
      <Card className="group relative overflow-hidden border-border/50 bg-black/40 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-black/60 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 z-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <CardHeader className="relative z-10 flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Folder className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold leading-none tracking-tight">{name}</h3>
              <p className="text-xs text-muted-foreground">
                Created {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </CardHeader>
        <CardContent className="relative z-10 pb-4">
          <div className="flex flex-wrap gap-2">
            <Badge icon={<GraduationCap className="h-3 w-3" />} text={dept} />
            <Badge icon={<Calendar className="h-3 w-3" />} text={getYearString(year)} />
            <Badge icon={<Users className="h-3 w-3" />} text={`Batch ${batch}`} />
            <Badge icon={<Folder className="h-3 w-3" />} text={`Group ${groupName}`} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-foreground">
      {icon}
      {text}
    </div>
  );
}
