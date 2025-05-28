import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '#/shadcn/components/ui/breadcrumb';
import { Separator } from '#/shadcn/components/ui/separator';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from '#/shadcn/components/ui/sidebar';
import { cn } from '#/shadcn/lib/utils';
import { ComponentProps } from 'react';


// TODO: 작업
/** 사이드 메뉴 */
function AppSideBar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>헤더</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>그룹1</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>안녕</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}

function AppBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Home 01</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Menu 01</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Page 01</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function SidebarLayout({ children, className, ...props }: ComponentProps<'section'>) {
  return (
    <SidebarProvider>
      <AppSideBar />
      <SidebarInset className="grid grid-rows-[auto_auto_1fr]">
        <header className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <AppBreadcrumb />
        </header>
        <Separator orientation="horizontal" />
        <section {...props} className={cn('scroll p-2', className)}>
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
