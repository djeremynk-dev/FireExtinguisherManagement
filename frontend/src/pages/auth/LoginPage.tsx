import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import PasswordInput from '../../components/auth/PasswordInput';
import AuthButton from '../../components/auth/AuthButton';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!email) next.email = 'Email is required';
        if (!password) next.password = 'Password is required';
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        setFormError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setFormError(getErrorMessage(err, 'Login failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Login" subtitle="Access your fire safety management account">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {formError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {formError}
                    </p>
                )}
                <AuthInput
                    label="Email Address *"
                    placeholder="john.doe@company.com"
                    type="email"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                />
                <PasswordInput
                    label="Password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    helperText="Enter your account password"
                />
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-slate-600">
                        <input type="checkbox" className="rounded border-slate-300 text-[#A02000] focus:ring-[#A02000]" />
                        Remember me
                    </label>
                    <Link to="/forgot-password" className="text-[#A02000] font-semibold hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <AuthButton loading={loading}>Login</AuthButton>
                <p className="text-center text-sm text-slate-500 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-[#A02000] font-bold hover:underline">
                        Create account
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
