import { Role, Status } from '@prisma/client';

export type User = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: Role;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  password_reset_token?: string | null;
  password_reset_expires?: Date | null;
};

export type UserFormState = {
  success: boolean;
  errors: Record<string, string[]>;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: Role;
    status: Status;
  };
  globalError: string | null;
};

export type GetUsersParams = {
  page?: string;
  limit?: string;
  search?: string;
  roleFilter?: string;
  statusFilter?: string;
  sortField?: string;
  sortDirection?: string;
};

export type GetUsersResult = {
  users: User[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export type GetUsersResultWithoutPagination = {
  users: User[];
};

export type AdminUsersPageProps = {
  searchParams: Promise<GetUsersParams>;
};

export type UserFormProps = {
  user?: Omit<
    User,
    | 'createdAt'
    | 'updatedAt'
    | 'password_reset_token'
    | 'password_reset_expires'
  > | null;
  mode: 'create' | 'update';
};

export type UserViewProps = {
  user: User;
};

export interface PageProps {
  params: Promise<{ id: string }>;
}

export type UsersTableProps = {
  users: User[];
  currentUserId: number;
  // Pagination props
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  // Current state props
  sortField: string;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
};
