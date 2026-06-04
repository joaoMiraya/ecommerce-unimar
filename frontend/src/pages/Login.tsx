import { useEffect } from "react";
import { LoginForm } from "../features/auth/components/LoginForm"
import { useAuth } from "../features/auth/hooks/useAuth"
import { useNavigate } from "react-router";


export const Login = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="flex justify-center">
            <LoginForm/>
        </div>
    )
}