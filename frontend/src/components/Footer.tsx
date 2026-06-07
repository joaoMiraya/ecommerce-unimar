import { Link } from "react-router"

export const Footer = () => {

    return (
        <footer className="bg-[#D1822C] p-4 flex justify-center items-center">
            <Link to={'/'} className="text-xl font-bold text-amber-50 cursor-pointer hover:opacity-80 transition-discrete">
                UNICOMMERCE
            </Link>
        </footer>
    )
}