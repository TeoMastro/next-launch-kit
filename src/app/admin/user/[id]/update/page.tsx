import { notFound } from "next/navigation";
import { UserForm } from "@/components/admin/user-form";
import { PageProps } from "@/types/user";
import { getUserById } from "@/server-actions/user";

export default async function UpdateUserPage({ params }: PageProps) {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    
    if (isNaN(userId)) {
        notFound();
    }

    const user = await getUserById(userId);

    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6">
            <UserForm user={user} mode="update" />
        </div>
    );
}
