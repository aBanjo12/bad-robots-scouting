"use client"

import * as React from "react";
import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  versions: ["2024ohmv"],
  navMain: [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Teams",
      url: "/teams",
      items: [
        {
          title: "Search Teams",
          url: "/search",
        },
        {
          title: "Team List",
          url: "/teams/list",
        },
      ],
    },
    {
      title: "API Reference",
      url: "/api",
      items: [
        {
          title: "Blue API",
          url: "/api/blue",
        },
        {
          title: "Statbotics API",
          url: "/api/statbotics",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const [competitionIds, setCompetitionIds] = React.useState([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCompetitionIds = JSON.parse(localStorage.getItem('competitionIds')) || [];
      setCompetitionIds(storedCompetitionIds);
    }
  }, []);

  return (
      <Sidebar {...props}>
        <SidebarHeader>
          <VersionSwitcher versions={competitionIds} defaultVersion={competitionIds[0]} />
          <SearchForm />
        </SidebarHeader>
        <SidebarContent>
          {data.navMain.map((item) => (
              <SidebarGroup key={item.title}>
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items ? (
                        item.items.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild>
                                <a href={subItem.url}>{subItem.title}</a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    ) : (
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
  );
}