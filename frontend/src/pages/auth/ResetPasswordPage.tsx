import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/auth/PasswordInput';
import AuthButton from '../../components/auth/AuthButton';
import { authApi } from '../../api/auth';
import { getErrorMessage } from '../../api/client';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const token = searchParams.get('token') || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!token) next.token = 'Reset token is missing. Use the link from your email.';
        if (!password) next.password = 'New password is required';
        if (password !== confirm) next.confirm = 'Passwords do not match';
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        setFormError('');
        try {
            await authApi.resetPassword(token, password);
            navigate('/login');
        } catch (err) {
            setFormError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Reset Password" subtitle="Choose a new password for your account">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {errors.token && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {errors.token}
                    </p>
                )}
                {formError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {formError}
                    </p>
                )}
                <PasswordInput
                    label="New Password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    helperText="At least 8 characters"
                />
                <PasswordInput
                    label="Confirm Password *"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    error={errors.confirm}
                />
                <AuthButton loading={loading}>Update Password</AuthButton>
                <p className="text-center text-sm text-slate-500 mt-6">
                    <Link to="/login" className="text-[#A02000] font-bold hover:underline">
                        Back to login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordPage;
