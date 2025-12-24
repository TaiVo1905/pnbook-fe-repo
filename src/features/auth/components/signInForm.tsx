import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useSignIn } from '@/features/auth/hooks/useSignIn';

import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { signInSchema } from '@/features/auth/schemas/signIn.schema';
import type { SignInFormValues } from '@/features/auth/schemas/signIn.schema';

export default function SignInForm() {
  const { submit, loading, error, success } = useSignIn();
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

  return (
    <div className="bg-card text-card-foreground mx-auto w-full max-w-md rounded-lg border p-6 shadow-sm">
      <h2 className="mb-6 text-center text-2xl font-bold">Sign In</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Sign In Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
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
            <p className="text-sm text-red-600">{errors.password.message}</p>
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
        <Button className="bg-white-500 flex w-full items-center justify-center gap-2 border text-black hover:bg-gray-100">
          <FcGoogle className="text-xl" />
          Sign in with Google
        </Button>
      </div>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
