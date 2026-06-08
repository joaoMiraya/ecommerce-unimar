import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../queries/auth";
import type { AuthResponse } from "../types/auth.types";
import { Button } from "../../../components/Button";
import { useAuth } from "../hooks/useAuth";
import type { BasicUser } from "../../user/types/user.types";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";

export const RegisterForm = () => {
  const [sending, setSending] = useState(false);
  const [registerApi] = useRegisterMutation();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSending(true);
    try {
      const response: AuthResponse<BasicUser> = await registerApi(data).unwrap();
      if (response) {
        login(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="flex flex-col gap-2 bg-amber-50 p-4 rounded-md min-w-1/2" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold text-zinc-950 text-center">Crie sua conta</h2>
      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="name">Nome:</label>
        <input className="border border-zinc-900 rounded-sm p-1"
          type="text" placeholder="Insira seu nome"
          {...register("name")}
        />
        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="email">Email:</label>
        <input className="border border-zinc-900 rounded-sm p-1"
          type="email" placeholder="Insira seu e-mail"
          {...register("email")}
        />
        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="password">Senha:</label>
        <input className="border border-zinc-900 rounded-sm p-1"
          placeholder="Insira sua senha" type="password"
          {...register("password")}
        />
        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="confirmPassword">Confirme sua senha:</label>
        <input className="border border-zinc-900 rounded-sm p-1"
          placeholder="Confirme sua senha" type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
      </div>
      <Button className="bg-[#D1AC2B] max-w-32 p-2 self-end" disabled={sending} type="submit">Enviar</Button>
    </form>
  );
};
