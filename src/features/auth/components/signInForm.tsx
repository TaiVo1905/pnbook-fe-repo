import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/core/shadcn/components/ui/input';
import { Label } from '@/core/shadcn/components/ui/label';
import { Button } from '@/core/shadcn/components/ui/button';
import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useSignIn } from '@/features/auth/hooks/useSignIn';

import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { signInSchema } from '@/features/auth/schemas/signIn.schema';
import type { SignInFormValues } from '@/features/auth/schemas/signIn.schema';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

export default function SignInForm() {
  const { submit, loading, error, success } = useSignIn();
  const {
    submit: googleSubmit,
    loading: googleLoading,
    error: googleError,
    success: googleSuccess,
  } = useGoogleSignIn();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: SignInFormValues) => {
    const isSuccess = await submit(values);
    if (isSuccess) reset();
  };

  useEffect(() => {
    if (error || googleError) toast.error(error || googleError);
    if (success || googleSuccess) toast.success(success || googleSuccess);
  }, [error, success, googleError, googleSuccess]);

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="relative space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
          />
          <span
            className="absolute top-9 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-gray-300"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <Button
          type="button"
          onClick={async () => {
            await googleSubmit();
          }}
          disabled={googleLoading}
          className="bg-white-500 flex w-full items-center justify-center gap-2 border text-black hover:bg-gray-100"
        >
          <FcGoogle className="text-xl" />
          {googleLoading ? 'Signing In...' : 'Sign In with Google'}
        </Button>
      </div>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        Don’t have an account?{' '}
        <Link to="/sign-up" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
