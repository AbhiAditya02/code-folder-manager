import { db } from "@/db";
import { folders } from "@/db/schema";
import { desc, or, ilike } from "drizzle-orm";
import { FolderCard } from "@/components/FolderCard";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { FolderSearch } from "@/components/FolderSearch";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;

  let conditions = undefined;
  if (query) {
    conditions = or(
      ilike(folders.dept, `%${query}%`),
      ilike(folders.subject, `%${query}%`),
      ilike(folders.batch, `%${query}%`),
      ilike(folders.group_name, `%${query}%`),
      // Since year is int, we'll only search text fields for simplicity, 
      // or we can cast year to text in raw sql. For now, text fields.
      ilike(folders.name, `%${query}%`)
    );
  }

  const allFolders = await db.query.folders.findMany({
    where: conditions,
    orderBy: [desc(folders.createdAt)],
  });

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-white/60">
            Your Code Vault
          </h1>
          <p className="text-muted-foreground">
            Manage and organize all your code snippets by department and batch.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <FolderSearch />
          <CreateFolderDialog />
        </div>
      </div>

      {allFolders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-black/20 py-32 backdrop-blur-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
            <svg
              className=" h-10 w-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No folders found</h2>
          <p className="text-muted-foreground max-w-sm text-center mb-6">
            {query ? `No folders match "${query}". Try another search term.` : "Get started by creating your first folder to store code files."}
          </p>
          {!query && <CreateFolderDialog />}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              dept={folder.dept}
              subject={folder.subject}
              year={folder.year}
              batch={folder.batch}
              groupName={folder.group_name}
              createdAt={folder.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
