import { Link, useLocation } from "react-router"
import { Button } from "./Button";
import { SignOutIcon, UserCircleIcon } from "@phosphor-icons/react";

export const Header = () => {
    const { pathname } = useLocation();
    const isAuthenticated = false;

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
              <Button>
                    <SignOutIcon size={24} />
                </Button>
            </div>
        }
        </header>
    )
}