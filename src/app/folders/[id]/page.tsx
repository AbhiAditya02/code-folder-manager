import { db } from "@/db";
import { folders, codeFiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileCard } from "@/components/FileCard";

interface PageProps {
  params: { id: string };
}

export default async function FolderPage({ params }: PageProps) {
  // Fix for Next.js 15: await params if it's treated as a promise, but in Next 14 it's sync.
  // Assuming Next 14 standard usage here.
  const { id } = params;

  const folder = await db.query.folders.findFirst({
    where: eq(folders.id, id),
    with: {
      files: {
        orderBy: [desc(codeFiles.createdAt)],
      },
    },
  });

  if (!folder) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              {folder.name}
            </h1>
            <p className="text-muted-foreground mt-2">
              Dept: {folder.dept} • Year: {folder.year} • Batch: {folder.batch} • Group: {folder.group_name}
            </p>
          </div>
          <Link href={`/folders/${id}/new`}>
            <Button className="group relative overflow-hidden rounded-full bg-primary px-6 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(var(--primary),0.5)]">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]" />
              <Plus className="mr-2 h-4 w-4" />
              Add File
            </Button>
          </Link>
        </div>
      </div>

      {folder.files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-black/20 py-32 backdrop-blur-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
            <svg
              className=" h-10 w-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No files yet</h2>
          <p className="text-muted-foreground max-w-sm text-center mb-6">
            Get started by adding your first code snippet to this folder.
          </p>
          <Link href={`/folders/${id}/new`}>
            <Button className="rounded-full bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.3)]">
              <Plus className="mr-2 h-4 w-4" />
              Add File
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {folder.files.map((file) => (
            <FileCard
              key={file.id}
              id={file.id}
              heading={file.heading}
              language={file.language}
              createdAt={file.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
