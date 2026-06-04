import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../queries/auth";
import { useAppDispatch } from "../../../store/hooks";
import { login as loginAction } from "../store/auth_slice";
import type { AuthResponse } from "../types/auth.types";
import { Button } from "../../../components/Button";

export const LoginForm = () => {
    const [sending, setSending] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loginApi] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmitForm = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        try {
            const response = await loginApi(formData).unwrap();
            if (response && (response as AuthResponse).data.user) {
                dispatch(loginAction({ user: (response as AuthResponse).data.user }));
                navigate('/profile');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
        <form className="flex flex-col gap-2 bg-amber-50 p-4 rounded-md min-w-1/2"
            onSubmit={(e: SubmitEvent<HTMLFormElement>) => handleSubmitForm(e)}
        >
            <h2 className="text-xl font-bold text-zinc-950 text-center">Acesse sua conta</h2>
            <div className="flex flex-col">
                <label className="text-sm text-zinc-900 font-bold" htmlFor="email">Email:</label>
                <input className="border border-zinc-900 rounded-sm p-1"
                    type="email" name="email"
                    placeholder="Insira seu e-mail"
                    onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        email: e.target.value
                    }))}
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-zinc-900 font-bold"
                    htmlFor="password">Senha:</label>
                <input className="border border-zinc-900 rounded-sm p-1"
                    placeholder="Insira sua senha"
                    type="password" name="password"
                    onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        password: e.target.value
                    }))}
                />
            </div>
            <Button className="bg-[#D1AC2B] max-w-32 p-2 self-end" disabled={sending} type="submit">Enviar</Button>
        </form>
        </>
    )
}
