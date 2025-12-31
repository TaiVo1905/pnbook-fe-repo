import SignInForm from '@/features/auth/components/SignInForm';
import AuthLayout from '@/features/auth/layouts/AuthLayout';

const SignInPage = () => {
  return (
    <AuthLayout>
      <div>
        <h1 className="mb-4 text-center text-2xl font-bold">Sign in</h1>
        <SignInForm />
      </div>
    </AuthLayout>
  );
};

export default SignInPage;
