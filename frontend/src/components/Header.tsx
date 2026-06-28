import { Link, useLocation, useNavigate } from "react-router"
import { Button } from "./Button";
import { ShoppingCartSimpleIcon, SignOutIcon, UserCircleIcon, XIcon } from "@phosphor-icons/react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useLogoutMutation } from "../features/auth/queries/auth";
import type { BasicUser } from "../features/user/types/user.types";
import { useEffect, useRef, useState } from "react";
import { selectCartCount } from "../features/cart/store/cart.selectors";
import { useSelector } from "react-redux";

export const Header = () => {
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const cartCount = useSelector(selectCartCount);

    const { pathname } = useLocation();
    const { isAuthenticated, logout, user } = useAuth();
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpenMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-[#D1822C] p-4 flex justify-between items-center">
        <Link to={'/'} className="text-xl font-bold text-amber-50 cursor-pointer hover:opacity-80 transition-discrete">
            UNICOMMERCE
        </Link>
        {
            !isAuthenticated &&
                (pathname === '/login' ?
                    <Link to={'/register'} className="bg-[#D1BC72] p-1 rounded-sm">Register</Link> :
                    <Link to={'/login'} className="bg-[#D1BC72] p-1 rounded-sm">login</Link>
                )
        }
        <div className="flex gap-4">
            <Link to={'/cart'} className="relative">
                {cartCount > 0 && 
                <span className="absolute right-0 bottom-7 w-4 h-4 flex items-center justify-center rounded-full bg-red-400 text-white text-sm">
                    {cartCount}
                </span>
                }
                <ShoppingCartSimpleIcon size={32} />
            </Link>
            {isAuthenticated &&
                <>
                    <div className="flex gap-4 items-center relative">
                        {openMenu &&
                            <Button onClick={() => setOpenMenu(false)}>
                                <XIcon size={32} />
                            </Button>
                        }
                        {!openMenu &&
                            <Button onClick={() => setOpenMenu(!openMenu)}>
                                <UserCircleIcon size={32} />
                            </Button>
                        }
                    </div>
                        {openMenu &&
                            <FloatMenu user={user} handleLogout={handleLogout} menuRef={menuRef} />
                        }
                </>
            }
        </div>
        </header>
    )
}

type FloatMenuProps = {
    user: BasicUser | null;
    handleLogout: () => void;
    menuRef: React.RefObject<HTMLDivElement | null>;
}
const FloatMenu = (props: FloatMenuProps) => {
    const { user, handleLogout, menuRef} = props;

    return (
        <div ref={menuRef} className="w-1/4 min-w-65 flex flex-col items-center absolute bg-gray-200 top-16 right-0 z-10">
            <Link to={'/profile'} className="flex items-center justify-center text-4xl font-bold rounded-full p-4 m-2 bg-amber-50 w-16 h-16">
                {user?.name?.charAt(0).toUpperCase()}
            </Link>
                <span className="text-sm">{user?.name}</span>
            <ul className="flex flex-col w-full my-2 items-center border-t border-gray-600">
                <Link to={'/'} className="flex w-full py-2 justify-center mt-6 text-center bg-gray-300 cursor-pointer hover:bg-gray-400">
                    Produtos
                </Link>
                <Link to={'/products'} className="flex w-full py-2 justify-center text-center bg-gray-300 cursor-pointer hover:bg-gray-400">
                    Cadastrar produtos
                </Link>
                <li onClick={() => handleLogout()} className="flex justify-center w-full mt-4 underline cursor-pointer">
                    <SignOutIcon size={24} /> Desconectar
                </li>
            </ul>
        </div>
    )
}