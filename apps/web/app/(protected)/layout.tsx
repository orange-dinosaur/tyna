export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-start min-h-svh">
            <div className="bg-muted flex items-center justify-start gap-4 w-full h-24">
                <h1>Protected Layout</h1>
                <h1>Page 1</h1>
                <h1>Page 2</h1>
            </div>
            <div className="flex items-center justify-center w-full overflow-x-hidden flex-1 bg-gray-600">
                {children}
            </div>
        </div>
    );
}
