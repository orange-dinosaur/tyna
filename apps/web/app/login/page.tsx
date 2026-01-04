import { LoginForm } from '@/components/login-form';
import { images } from '@workspace/assets';
import { FieldDescription } from '@workspace/ui-web/components/field';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <Link href="/">
                <Image
                    src={images.logo}
                    alt="App Logo"
                    width={50}
                    height={50}
                    className="w-auto"
                />
            </Link>

            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-xl font-bold">
                    Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
                </h1>
                <FieldDescription>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup">Sign up</Link>
                </FieldDescription>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-6">
                <LoginForm />
            </div>
        </div>
    );
}
