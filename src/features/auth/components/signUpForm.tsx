import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/core/shadcn/components/ui/input';
import { Label } from '@/core/shadcn/components/ui/label';
import { Button } from '@/core/shadcn/components/ui/button';
import { toast } from 'sonner';

import { signUpSchema } from '@/features/auth/schemas/signUp.schema';
import type { SignUpFormValues } from '@/features/auth/schemas/signUp.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { useSignUp } from '@/features/auth/hooks/useSignUp';

export default function SignUpForm() {
  const { submit, loading, error, success } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (values: SignUpFormValues) => {
    const isSuccess = await submit(values);
    if (isSuccess) reset();
  };

  useEffect(() => {
    if (error) toast.error(error);
    if (success) toast.success(success);
  }, [error, success]);

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

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

        <div className="relative space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            {...register('confirmPassword')}
          />
          <span
            className="absolute top-9 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-gray-300"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <Button className="bg-white-500 flex w-full items-center justify-center gap-2 border text-black hover:bg-gray-100">
          <FcGoogle className="text-xl" />
          Sign up with Google
        </Button>
      </div>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/signin" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
