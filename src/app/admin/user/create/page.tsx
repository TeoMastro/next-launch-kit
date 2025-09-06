import { UserForm } from '@/components/admin/user-form';

export default async function CreateUserPage() {
  return (
    <div className="container mx-auto py-6">
      <UserForm mode="create" />
    </div>
  );
}
