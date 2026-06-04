import React from 'react';
import type { LucideIcon } from 'lucide-react';

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon: LucideIcon;
    error?: string;
    helperText?: string;
};

const AuthInput: React.FC<AuthInputProps> = ({
    label,
    icon: Icon,
    error,
    helperText,
    className = '',
    ...inputProps
}) => {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    {...inputProps}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all bg-white ${
                        error
                            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                            : 'border-slate-200 focus:ring-2 focus:ring-[#A02000]/20 focus:border-[#A02000]'
                    } ${className}`}
                />
            </div>
            {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
            {!error && helperText && <p className="text-[9px] text-slate-400 leading-tight">{helperText}</p>}
        </div>
    );
};

export default AuthInput;
