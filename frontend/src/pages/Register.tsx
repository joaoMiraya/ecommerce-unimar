import { useNavigate } from "react-router";
import { RegisterForm } from "../features/auth/components/RegisterForm"
import { useAuth } from "../features/auth/hooks/useAuth";
import { useEffect } from "react";


export const Register = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="flex justify-center">
            <RegisterForm />
        </div>
    )
}