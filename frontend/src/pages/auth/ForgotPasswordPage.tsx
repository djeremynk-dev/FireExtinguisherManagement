import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { authApi } from '../../api/auth';
import { getErrorMessage } from '../../api/client';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [devToken, setDevToken] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('A valid email is required');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const { data: body } = await authApi.forgotPassword(email);
            const message = body.message || body.data?.message || 'Reset link sent if the email exists.';
            setSuccess(message);
            const token = body.resetToken || body.data?.resetToken;
            if (token) setDevToken(token);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Forgot Password" subtitle="Enter your email and we'll send a reset link">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <p className="text-sm text-slate-600 leading-relaxed">
                    We will send a secure password reset link to your email address.
                </p>
                {success && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                        {success}
                        {devToken && (
                            <span className="block mt-2 text-xs">
                                Dev reset token:{' '}
                                <Link to={`/reset-password?token=${devToken}`} className="underline font-mono">
                                    use this link
                                </Link>
                            </span>
                        )}
                    </p>
                )}
                <AuthInput
                    label="Email Address *"
                    placeholder="john.doe@company.com"
                    type="email"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                />
                <AuthButton loading={loading}>Send Reset Link</AuthButton>
                <p className="text-center text-sm text-slate-500 mt-6">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-[#A02000] font-bold hover:underline">
                        Back to login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
