import { getSession } from '@/lib/auth-session';
import { notFound } from 'next/navigation';
import { UsersTable } from '@/components/admin/user-table';
import { getUsersWithPagination } from '@/server-actions/user';
import { AdminUsersPageProps } from '@/types/user';

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session = await getSession();

  if (!session || session.user.role !== 'ADMIN') {
    notFound();
  }

  const params = await searchParams;
  const { users, totalCount, totalPages, currentPage, limit } =
    await getUsersWithPagination(params);

  return (
    <div className="container mx-auto py-6">
      <UsersTable
        users={users}
        currentUserId={+session.user.id}
        // Pagination props
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        limit={limit}
        // Current state props
        sortField={params.sortField || 'createdAt'}
        sortDirection={(params.sortDirection as 'asc' | 'desc') || 'desc'}
        searchTerm={params.search || ''}
        roleFilter={params.roleFilter || 'all'}
        statusFilter={params.statusFilter || 'all'}
      />
    </div>
  );
}
