import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
};

export const Button = ({
    children,
    className = "",
    ...rest
}: ButtonProps) => {
    return (
        <button
            className={`rounded-sm cursor-pointer ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};