import React from 'react';

type AuthButtonProps = {
    children: React.ReactNode;
    loading?: boolean;
    type?: 'button' | 'submit';
};

const AuthButton: React.FC<AuthButtonProps> = ({ children, loading = false, type = 'submit' }) => {
    return (
        <button
            type={type}
            disabled={loading}
            className="w-full bg-[#8B1A00] hover:bg-[#A02000] text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? 'Please wait...' : children}
        </button>
    );
};

export default AuthButton;