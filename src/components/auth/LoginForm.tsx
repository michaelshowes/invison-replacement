'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FaMicrosoft, FaSlack } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { signIn } from '@/server/user';
import { socialSignIn } from '@/utils/socialSignIn';

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { success, message } = await signIn(values.email, values.password);

    if (success) {
      toast.success(message as string);
      router.push('/app');
    } else {
      toast.error(message as string);
    }
    setIsLoading(false);
  }

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription>
            Login with your Google or Microsoft account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid gap-6'>
                <div className='flex flex-col gap-4'>
                  <Button
                    variant='outline'
                    className='w-full'
                    type='button'
                    onClick={() => socialSignIn('google')}
                  >
                    <FcGoogle />
                    Login with Google
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full'
                    type='button'
                    onClick={() => socialSignIn('microsoft')}
                  >
                    <FaMicrosoft />
                    Login with Microsoft
                  </Button>
                </div>
                <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                  <span className='bg-card text-muted-foreground relative z-10 px-2'>
                    Or continue with
                  </span>
                </div>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='email'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <div className='flex flex-col gap-2'>
                      <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type='password'
                                placeholder='********'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <a
                        href='#'
                        className='ml-auto text-sm underline-offset-4 hover:underline'
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : (
                      'Login'
                    )}
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Don&apos;t have an account?{' '}
                  <a
                    href='/auth/sign-up'
                    className='underline underline-offset-4'
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
