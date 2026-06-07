import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { useProfileQuery } from "../../auth/queries/auth"
import { useDeleteMutation } from "../queries/user.query";
import { ProfileForm } from "./ProfileForm";
import { useAuth } from "../../auth/hooks/useAuth";


export const ProfileComponent = () => {
    const { data, isLoading, isError } = useProfileQuery();
    const { logout } = useAuth();
    const [disable] = useDeleteMutation();
    const navigate = useNavigate();

    const user = data?.data.user;
    if (isLoading) return <div>Carregando...</div>;
    if (isError || !user) return <div>Erro ao carregar perfil</div>;    

    const handleDisableAccount = async () => {
       try {
            await disable();
            logout()
            navigate('/login');
       } catch {
        console.error("Ocorreu um erro!")
       }
    }
    return (
        <div className="flex flex-col">
            <div className="relative self-center bg-[#D1AC2B] w-full p-6 rounded-md flex justify-center items-center">
                <div className="flex items-center justify-center text-4xl font-bold rounded-full p-4 bg-amber-50 w-24 h-24">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <span className="absolute bottom-2 right-2 text-sm text-slate-50">
                    Desde: {
                        user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                            : ''
                    }
                </span>
            </div>
            <Button onClick={() => handleDisableAccount()} className="p self-end text-gray-400 underline my-2">Deletar conta</Button>
            <ProfileForm user={user} />
        </div>
    )
}