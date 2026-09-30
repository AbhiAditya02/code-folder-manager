import { FileCode2, Clock, ChevronRight, Copy } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FileCardProps {
  id: string;
  heading: string;
  language: string;
  createdAt: Date;
}

export function FileCard({ id, heading, language, createdAt }: FileCardProps) {
  return (
    <Link href={`/files/${id}`}>
      <Card className="group relative overflow-hidden border-border/50 bg-black/40 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-black/60 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]">
        <div className="absolute inset-0 z-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <FileCode2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold leading-none tracking-tight">{heading}</h3>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </CardHeader>
        <CardContent className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-border/50 bg-background/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-foreground">
              {language}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
