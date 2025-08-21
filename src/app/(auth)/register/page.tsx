'use client'
import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import {useState} from "react";
import {useAuth} from "@/components/auth/AuthProvider";
import {useRouter} from "next/navigation";

export default function Register() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            setError('First name is required');
            return false;
        }
        if (!formData.lastName.trim()) {
            setError('Last name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!formData.phoneNumber.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (formData.phoneNumber.length < 10) {
            setError('Phone number must be at least 10 digits');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Transform the data to match backend expectations
            const registrationData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone_number: formData.phoneNumber,
                password: formData.password
            };

            console.log('📝 Submitting registration:', registrationData);

            const result = await register(registrationData);

            if (result.success) {
                console.log('✅ Registration successful');
                setSuccess(true);
            } else {
                console.log('❌ Registration failed:', result.error);
                setError(result.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="grid w-full max-w-sm grid-cols-1 gap-8 text-center">
                <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />

                <div className="rounded-md bg-grey-800 p-4 border border-grey-200">
                    <Heading level={2} className="text-green-800 mb-2">
                        Registration Successful!
                    </Heading>
                    <Text className="text-green-700 text-sm">
                        We&#39;ve sent a confirmation email to <Strong>{formData.email}</Strong>.
                        Please check your email and click the confirmation link to activate your account.
                    </Text>
                </div>

                <div className="space-y-4">
                    <Button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="w-full"
                    >
                        Go to Login
                    </Button>

                    <Text className="text-sm">
                        Didn&#39;t receive the email?{' '}
                        <TextLink href="/resend-verification">
                            <Strong>Resend verification email</Strong>
                        </TextLink>
                    </Text>
                </div>
            </div>
        );
    }
    return (
        <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
            {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
            <Heading>Create your account</Heading>
            <Field>
                <Label>First name</Label>
                <Input
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                />
            </Field>
            <Field>
                <Label>Last name</Label>
                <Input
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                />
            </Field>
            <Field>
                <Label>Email</Label>
                <Input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                />
            </Field>
            <Field>
                <Label>Phone number</Label>
                <Input
                    type="tel"
                    name="phoneNumber"
                    autoComplete="tel"
                    required
                    placeholder="e.g., +1234567890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={loading}
                />
            </Field>
            <Field>
                <Label>Password</Label>
                <Input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                />
                <Text className="text-xs text-gray-600 mt-1">
                    Must be at least 8 characters with uppercase, lowercase, number, and special character
                </Text>
            </Field>

            <Field>
                <Label>Confirm password</Label>
                <Input
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                />
            </Field>

            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
                ) : (
                    'Create account'
                )}
            </Button>

            <Text>
                Already have an account?{' '}
                <TextLink href="/login">
                    <Strong>Sign in</Strong>
                </TextLink>
            </Text>
        </form>
    )
}
