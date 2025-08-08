import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserForm } from "@/components/admin/user-form";

export default async function CreateUserPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="container mx-auto py-6">
            <UserForm mode="create" />
        </div>
    );
}
