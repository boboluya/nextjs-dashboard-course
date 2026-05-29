import Form from '@/app/dashboard/my_user/_component/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'My User', href: '/dashboard/my_user' },
          {
            label: 'Create My User',
            href: '/dashboard/my_user/create',
            active: true,
          },
        ]}
      />
      <Form />

    </main>
  );
}
