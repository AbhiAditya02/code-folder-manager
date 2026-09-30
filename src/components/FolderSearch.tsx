"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";


export function FolderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`/?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, router, searchParams]);

  return (
    <div className="relative w-full md:w-80 lg:w-96">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search dept, year, batch..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 rounded-full bg-black/40 border-border/50 focus-visible:ring-primary/50 backdrop-blur-sm shadow-[0_0_15px_rgba(var(--primary),0.05)] hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] transition-all"
      />
    </div>
  );
}
