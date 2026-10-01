import { db } from "@/db";
import { codeFiles, folders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeViewer } from "@/components/CodeViewer";
import { DeleteFileButton } from "@/components/DeleteFileButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FilePage({ params }: PageProps) {
  const { id } = await params;

  const file = await db.query.codeFiles.findFirst({
    where: eq(codeFiles.id, id),
    with: {
      folder: true,
    },
  });

  if (!file) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] pb-10">
      <div className="flex flex-col gap-6">
        <Link
          href={`/folders/${file.folderId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Folder ({file.folder.name})
        </Link>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-white/60">
              {file.heading}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-black/40 px-3 py-1 text-sm font-medium text-primary">
                {file.language}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created {new Date(file.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          
          <DeleteFileButton fileId={file.id} folderId={file.folderId} />
        </div>
      </div>

      <div className="flex-1 mt-2 flex flex-col min-h-0">
        <CodeViewer content={file.content} language={file.language} filename={file.heading} />
      </div>
    </div>
  );
}
