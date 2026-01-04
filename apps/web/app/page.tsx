export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-svh">
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">
                    Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
                </h1>
            </div>
        </div>
    );
}
