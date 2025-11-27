import { cn } from '@workspace/ui-web/lib/utils';
import { Button } from '@workspace/ui-web/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui-web/components/card';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@workspace/ui-web/components/field';
import { Input } from '@workspace/ui-web/components/input';
import Link from 'next/link';

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Create your account
                    </CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Username</FieldLabel>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <Field>
                                    <FieldLabel htmlFor="confirm-password">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                    />
                                </Field>
                            </Field>
                            <Field>
                                <Field>
                                    <FieldLabel htmlFor="confirm-password">
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required
                                    />
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit">Create Account</Button>
                                <FieldDescription className="text-center">
                                    Already have an account?{' '}
                                    <Link href="/login">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            {/* <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </FieldDescription> */}
        </div>
    );
}
