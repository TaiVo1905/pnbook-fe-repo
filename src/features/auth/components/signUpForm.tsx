import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/core/shadcn/components/ui/input';
import { Label } from '@/core/shadcn/components/ui/label';
import { ActionButton } from '@/shared/components/ActionButton';
import { toast } from 'sonner';

import { signUpSchema } from '@/features/auth/schemas/signUp.schema';
import type { SignUpFormValues } from '@/features/auth/schemas/signUp.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { useSignUp } from '@/features/auth/hooks/useSignUp';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

export default function SignUpForm() {
  const { submit, loading, error, success } = useSignUp();
  const {
    submit: googleSubmit,
    loading: googleLoading,
    error: googleError,
    success: googleSuccess,
  } = useGoogleSignIn();

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
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (values: SignUpFormValues) => {
      const isSuccess = await submit(values);
      if (isSuccess) {
        reset();
        navigate('/sign-in');
      }
    },
    [submit, reset, navigate]
  );

  useEffect(() => {
    if (error || googleError) toast.error(error || googleError);
    if (success || googleSuccess) toast.success(success || googleSuccess);
  }, [error, success, googleError, googleSuccess]);

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
          <Label htmlFor="passwordConfirmation">Confirm Password</Label>
          <Input
            id="passwordConfirmation"
            type={showConfirm ? 'text' : 'password'}
            {...register('passwordConfirmation')}
          />
          <span
            className="absolute top-9 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
          {errors.passwordConfirmation && (
            <p className="text-xs text-red-600">
              {errors.passwordConfirmation.message}
            </p>
          )}
        </div>

        <ActionButton
          type="submit"
          variant="primary"
          loading={loading}
          fullWidth
        >
          Sign Up
        </ActionButton>
      </form>

      <div className="mt-6">
        <ActionButton
          type="button"
          onClick={async () => {
            await googleSubmit();
          }}
          disabled={googleLoading}
          variant="ghost"
          fullWidth
          className="flex items-center justify-center gap-2 border border-gray-200 bg-white"
        >
          <FcGoogle className="text-xl" />
          {googleLoading ? 'Signing In...' : 'Sign In with Google'}
        </ActionButton>
      </div>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/sign-in" className="text-blue-500 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
