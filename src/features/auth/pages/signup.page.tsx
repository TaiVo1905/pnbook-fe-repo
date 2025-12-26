import SignUpForm from '@/features/auth/components/signUpForm';
import AuthLayout from '@/features/auth/layouts/auth.layout';

const SignUpPage = () => {
  return (
    <AuthLayout>
      <div>
        <h1 className="mb-4 text-center text-2xl font-bold">Sign up</h1>
        <SignUpForm />
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
