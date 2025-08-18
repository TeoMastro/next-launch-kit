import { Role, Status } from "@prisma/client";

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
    user?: Omit<User, "created_at" | "updated_at" | "password" | "email_verification_token" | "email_verified_at"> | null;
    mode: "create" | "update";
}

export type UserViewProps = {
    user: User;
};

export type PageProps = {
    params: {
        id: string;
    };
};

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: Role;
    status: Status;
    created_at: Date;
    updated_at: Date;
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
    sortDirection: "asc" | "desc";
    searchTerm: string;
    roleFilter: string;
    statusFilter: string;
}
