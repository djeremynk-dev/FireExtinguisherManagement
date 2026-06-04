import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    helperText?: string;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...inputProps
}) => {
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    {...inputProps}
                    type={show ? 'text' : 'password'}
                    placeholder={inputProps.placeholder ?? '••••••••'}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none transition-all bg-white ${
                        error
                            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                            : 'border-slate-200 focus:ring-2 focus:ring-[#A02000]/20 focus:border-[#A02000]'
                    } ${className}`}
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
            {!error && helperText && <p className="text-[9px] text-slate-400 leading-tight">{helperText}</p>}
        </div>
    );
};

export default PasswordInput;
