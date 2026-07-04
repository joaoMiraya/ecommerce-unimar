import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    onClick?: () => void;
};

export const Button = ({
    children,
    onClick,
    className = "",
    ...rest
}: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`cursor-pointer ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};