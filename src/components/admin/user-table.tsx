'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { deleteUserAction } from '@/server-actions/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Eye, X, Download } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { Pagination } from '../layout/pagination';
import {
  SortableTableHeader,
  SortField,
} from '../layout/sortable-table-header';
import { Role, Status } from '@prisma/client';
import { UsersTableProps } from '@/types/user';
import { InfoAlert } from '@/components/info-alert';

export const getStatusBadge = (status: Status, t: (key: string) => string) => {
  switch (status) {
    case Status.ACTIVE:
      return {
        variant: 'default' as const,
        text: t('activeStatus'),
      };
    case Status.INACTIVE:
      return {
        variant: 'destructive' as const,
        text: t('inactiveStatus'),
      };
    case Status.UNVERIFIED:
      return {
        variant: 'outline' as const,
        text: t('unverifiedStatus'),
      };
    default:
      return {
        variant: 'secondary' as const,
        text: status,
      };
  }
};

export function UsersTable({
  users,
  currentUserId,
  totalCount,
  totalPages,
  currentPage,
  limit,
  sortField,
  sortDirection,
  searchTerm,
  roleFilter,
  statusFilter,
}: UsersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('app');

  // Local state for immediate UI feedback
  const [searchTermLocal, setSearchTermLocal] = useState(searchTerm);
  const [roleFilterLocal, setRoleFilterLocal] = useState(roleFilter);
  const [statusFilterLocal, setStatusFilterLocal] = useState(statusFilter);
  const [isPending, startTransition] = useTransition();
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  // Show success message if present in URL
  const message = searchParams.get('message');

  // Function to update URL with new params
  const updateUrl = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });
      router.push(`${pathname}?${current.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // Handle sorting
  const handleSort = useCallback(
    (field: SortField) => {
      const newDirection =
        sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

      updateUrl({
        sortField: field,
        sortDirection: newDirection,
        page: '1', // Reset to first page when sorting
      });
    },
    [sortField, sortDirection, updateUrl]
  );

  // Handle pagination
  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({ page: page.toString() });
    },
    [updateUrl]
  );

  // Debounced search handler
  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateUrl({
      search: value,
      page: '1', // Reset to first page when searching
    });
  }, 300);

  // Handle search input changes
  useEffect(() => {
    debouncedSearch(searchTermLocal);
  }, [searchTermLocal, debouncedSearch]);

  // Handle role filter changes
  const handleRoleFilterChange = useCallback(
    (value: string) => {
      setRoleFilterLocal(value);
      updateUrl({
        roleFilter: value,
        page: '1', // Reset to first page when filtering
      });
    },
    [updateUrl]
  );

  // Handle status filter changes
  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilterLocal(value);
      updateUrl({
        statusFilter: value,
        page: '1', // Reset to first page when filtering
      });
    },
    [updateUrl]
  );

  // Handle user deletion
  const handleDelete = async (userId: number) => {
    if (userId === currentUserId) {
      setAlert({
        message: t('cannotDeleteOwnAccount'),
        type: 'error',
      });
      return;
    }

    setDeletingUserId(userId);

    startTransition(async () => {
      try {
        await deleteUserAction(userId);
        setAlert({
          message: t('userDeletedSuccess'),
          type: 'success',
        });
      } catch (error) {
        setAlert({
          message:
            error instanceof Error ? t(error.message) : t('unexpectedError'),
          type: 'error',
        });
      } finally {
        setDeletingUserId(null);
      }
    });
  };

  const exportFilteredUsers = useCallback(
    async (format: 'csv' | 'xlsx') => {
      try {
        const params = new URLSearchParams({
          search: searchTermLocal || '',
          roleFilter: roleFilterLocal || 'all',
          statusFilter: statusFilterLocal || 'all',
          sortField: sortField || 'created_at',
          sortDirection: sortDirection || 'desc',
          format,
        });

        const response = await fetch(`/api/users-export?${params.toString()}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Export failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `users_export_${new Date()
          .toISOString()
          .slice(0, 10)}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        setAlert({
          message: t('exportError'),
          type: 'error',
        });
      }
    },
    [
      searchTermLocal,
      roleFilterLocal,
      statusFilterLocal,
      sortField,
      sortDirection,
      t,
    ]
  );

  const handleResetFilters = useCallback(() => {
    setSearchTermLocal('');
    setRoleFilterLocal('all');
    setStatusFilterLocal('all');
    updateUrl({
      search: '',
      roleFilter: 'all',
      statusFilter: 'all',
      page: '1',
    });
  }, [updateUrl]);

  const hasActiveFilters =
    searchTermLocal !== '' ||
    roleFilterLocal !== 'all' ||
    statusFilterLocal !== 'all';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('users')}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => exportFilteredUsers('csv')}
            variant="outline"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            .csv
          </Button>
          <Button
            onClick={() => exportFilteredUsers('xlsx')}
            variant="outline"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            .xlsx
          </Button>
          <Button onClick={() => router.push('/admin/user/create')}>
            <Plus className="h-4 w-4" />
            <div className="hidden md:block">{t('create')}</div>
          </Button>
        </div>
      </div>

      {/* Success message */}
      {message && <InfoAlert message={t(message) as string} type="success" />}

      {alert && <InfoAlert message={alert.message} type={alert.type} />}

      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder={t('searchUsers')}
          value={searchTermLocal}
          onChange={(e) => setSearchTermLocal(e.target.value)}
          className="w-full md:max-w-sm"
        />
        <Select value={roleFilterLocal} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t('filterByRole')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allRoles')}</SelectItem>
            <SelectItem value="USER">{t('userRole')}</SelectItem>
            <SelectItem value="ADMIN">{t('adminRole')}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilterLocal}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t('filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            <SelectItem value="ACTIVE">{t('activeStatus')}</SelectItem>
            <SelectItem value="INACTIVE">{t('inactiveStatus')}</SelectItem>
            <SelectItem value="UNVERIFIED">{t('unverifiedStatus')}</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="whitespace-nowrap"
          >
            <X className="mr-2 h-4 w-4" />
            {t('resetFilters')}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHeader
                field="name"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              >
                {t('name')}
              </SortableTableHeader>
              <SortableTableHeader
                field="email"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              >
                {t('email')}
              </SortableTableHeader>
              <SortableTableHeader
                field="role"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              >
                {t('role')}
              </SortableTableHeader>
              {/* Add status column header */}
              <SortableTableHeader
                field="status"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              >
                {t('status')}
              </SortableTableHeader>
              <SortableTableHeader
                field="created_at"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              >
                {t('created')}
              </SortableTableHeader>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const statusBadge = getStatusBadge(user.status, t);
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === Role.ADMIN ? 'default' : 'secondary'
                      }
                    >
                      {user.role === Role.ADMIN
                        ? t('adminRole')
                        : t('userRole')}
                    </Badge>
                  </TableCell>
                  {/* Add status column */}
                  <TableCell>
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.text}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/user/${user.id}`)}
                        disabled={isPending}
                        title={t('viewUser')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/user/${user.id}/update`)
                        }
                        disabled={isPending}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              user.id === currentUserId ||
                              isPending ||
                              deletingUserId === user.id
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t('confirmDelete')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('deleteUserConfirmation', {
                                name: `${user.first_name} ${user.last_name}`,
                              })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                            >
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {t('noUsersFound')}
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalCount={totalCount}
        limit={limit}
      />
    </div>
  );
}
