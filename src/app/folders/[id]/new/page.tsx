import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddFileForm } from "@/components/AddFileForm";

interface PageProps {
  params: { id: string };
}

export default function NewFilePage({ params }: PageProps) {
  // Fix for Next.js 15 treating params as Promise (assume sync for Next 14 here)
  const { id } = params;

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      <Link
        href={`/folders/${id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Folder
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Add New Snippet
        </h1>
        <p className="text-muted-foreground mt-2">
          Paste your code and add a heading to save it in this folder.
        </p>
      </div>

      <AddFileForm folderId={id} />
    </div>
  );
}
