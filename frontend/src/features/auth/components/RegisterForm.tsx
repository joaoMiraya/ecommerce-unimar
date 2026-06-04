import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router';
import { useRegisterMutation } from "../queries/auth";
import type { AuthResponse } from '../types/auth.types';
import { Button } from '../../../components/Button';
import { useAuth } from '../hooks/useAuth';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [sending, setSending] = useState(false);
  const [registerApi] = useRegisterMutation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmitForm = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    try {
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
        };
        const response: AuthResponse = await registerApi(payload).unwrap();
        if (response) {             
            login(response);
            navigate('/profile');
        }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };
    return (
        <form className="flex flex-col gap-2 bg-amber-50 p-4 rounded-md min-w-1/2"
            onSubmit={(e: SubmitEvent<HTMLFormElement>) => handleSubmitForm(e)}
        >
            <h2 className="text-xl font-bold text-zinc-950 text-center">Crie sua conta</h2>
            <div className="flex flex-col">
                <label className="text-sm text-zinc-900 font-bold" htmlFor="email">Nome:</label>
                <input className="border border-zinc-900 rounded-sm p-1"
                    type="text" name="name"
                    placeholder="Insira seu nome"
                    onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        name: e.target.value
                    }))}
                />
            </div>
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
            <div className="flex flex-col">
                <label className="text-sm text-zinc-900 font-bold"
                    htmlFor="confirmPassword">Confirme sua senha:</label>
                <input className="border border-zinc-900 rounded-sm p-1"
                    placeholder="Confirme sua senha"
                    type="password" name="confirmPassword"
                    onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value
                    }))}
                />
            </div>
            <Button className="bg-[#D1AC2B] max-w-32 p-2 self-end" disabled={sending} type="submit">Enviar</Button>
        </form>
    )
};
