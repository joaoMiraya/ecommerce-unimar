import { Link, useLocation, useNavigate } from "react-router"
import { Button } from "./Button";
import { SignOutIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useLogoutMutation } from "../features/auth/queries/auth";

export const Header = () => {
    const { pathname } = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const [ logoutApi ] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutApi().then(() => {
            logout();
            navigate('/login');
        }).catch((err) => {
            console.error(err)
        })
    }

    return (
        <header className="bg-[#D1822C] p-4 flex justify-between items-center">
        <Link to={'/'} className="text-xl font-bold text-amber-50 cursor-pointer hover:opacity-80 transition-discrete">UNIMMERCE</Link>
        {
            !isAuthenticated &&
                (pathname === '/login' ?
                    <Link to={'/register'} className="bg-[#D1BC72] p-1 rounded-sm">Register</Link> :
                    <Link to={'/login'} className="bg-[#D1BC72] p-1 rounded-sm">login</Link>
                )
        }
        {isAuthenticated &&
            <div className="flex gap-4 items-center">
                <Button>
                    <UserCircleIcon size={32} />
                </Button>
              <Button onClick={() => handleLogout()}>
                    <SignOutIcon size={24} />
                </Button>
            </div>
        }
        </header>
    )
}