"use client";

import { Search } from "lucide-react"
import { useRouter} from "next/navigation";

import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"

export function SearchForm({ ...props }) {
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchQuery = event.target.search.value;
    router.push(`/comp/{}/team/${searchQuery}`);
  };
  return (
    (<form {...props} onSubmit={handleSubmit}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput id="search" placeholder="Search Teams..." className="pl-8" />
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>)
  );
}
