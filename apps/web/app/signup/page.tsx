import { SignupForm } from '@/components/signup-form';
import { images } from '@workspace/assets';
import Image from 'next/image';

export default function SignupPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <Image
                src={images.logo}
                alt="App Logo"
                width={50}
                height={50}
                className="w-auto"
            />
            <div className="flex w-full max-w-sm flex-col gap-6">
                <SignupForm />
            </div>
        </div>
    );
}
