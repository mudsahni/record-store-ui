'use client'
import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import {useState} from "react";
import {useAuth} from "@/components/auth/AuthProvider";
import {useRouter} from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('Submitting login form...');

        try {
            const result = await login({ email, password });

            if (result.success) {
                console.log('Login successful, redirecting...');

                // Check if user must change password
                if (result.mustChangePassword) {
                    router.push('/change-password');
                } else {
                    router.push('/dashboard');
                }
            } else {
                console.log('Login failed:', result.error);
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
            {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}
            <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
            <Heading>Sign in to your account</Heading>
            <Field>
                <Label>Email</Label>
                <Input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    disabled={loading}
                />
            </Field>
            <Field>
                <Label>Password</Label>
                <Input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
            </Field>
            <div className="flex items-center justify-between">
                <CheckboxField>
                    <Checkbox name="remember" />
                    <Label>Remember me</Label>
                </CheckboxField>
                <Text>
                    <TextLink href="/forgot-password">
                        <Strong>Forgot password?</Strong>
                    </TextLink>
                </Text>
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={loading || !email || !password}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                    </span>
                ) : (
                    'Sign in'
                )}
            </Button>

            <Text>
                Don’t have an account?{' '}
                <TextLink href="/register">
                    <Strong>Sign up</Strong>
                </TextLink>
            </Text>
        </form>
    )
}
