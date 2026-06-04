import React, { useState } from 'react';
import { User, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import PasswordInput from '../../components/auth/PasswordInput';
import AuthButton from '../../components/auth/AuthButton';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!form.firstName) next.firstName = 'First name is required';
        if (!form.lastName) next.lastName = 'Last name is required';
        if (!form.email) next.email = 'Email is required';
        if (!form.password) next.password = 'Password is required';
        else if (!passwordPattern.test(form.password)) {
            next.password = 'Use 8+ chars with upper, lower, and number';
        }
        if (form.password !== form.confirmPassword) {
            next.confirmPassword = 'Passwords do not match';
        }
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        setFormError('');
        try {
            await register({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password
            });
            navigate('/dashboard');
        } catch (err) {
            setFormError(getErrorMessage(err, 'Registration failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join our fire safety management platform">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {formError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {formError}
                    </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AuthInput
                        label="First Name *"
                        placeholder="John"
                        icon={User}
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        error={errors.firstName}
                    />
                    <AuthInput
                        label="Last Name *"
                        placeholder="Doe"
                        icon={User}
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        error={errors.lastName}
                    />
                </div>
                <AuthInput
                    label="Email Address *"
                    placeholder="john.doe@company.com"
                    type="email"
                    icon={Mail}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    error={errors.email}
                />
                <PasswordInput
                    label="Password *"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    error={errors.password}
                    helperText="At least 8 characters with uppercase, lowercase, and number"
                />
                <PasswordInput
                    label="Confirm Password *"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    error={errors.confirmPassword}
                />
                <AuthButton loading={loading}>Create Account</AuthButton>
                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#A02000] font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;
