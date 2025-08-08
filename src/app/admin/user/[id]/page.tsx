import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserView } from "@/components/admin/user-view";
import { getUserById } from "@/server-actions/user";
import { PageProps } from "@/types/user";

export default async function ViewUserPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

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
            <UserView user={user} />
        </div>
    );
}
