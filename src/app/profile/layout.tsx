import SidebarLayout from '@/components/layout/sidebar-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
