import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useUpdateMutation } from "../queries/user.query";
import { Button } from "../../../components/Button";
import type { ProfileFormData } from "../schemas/profile.schema";

export const InfoForm = () => {
  const [loading, setLoading] = useState(false);
  const [updateInfo] = useUpdateMutation();
  const { register, handleSubmit, formState: { errors } } = useFormContext<ProfileFormData>();

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await updateInfo(data.user);
    } catch {
      console.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-2 mt-2 rounded-sm bg-slate-100 flex flex-col">
      <h2 className="text-xl">Informações pessoais</h2>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="name">Nome:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text"
          placeholder="Insira seu nome"
          {...register("user.name")}
        />
        {errors.user?.name && <span className="text-red-500 text-xs">{errors.user.name.message}</span>}
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="email">Email:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="email"
          {...register("user.email")}
        />
        {errors.user?.email && <span className="text-red-500 text-xs">{errors.user.email.message}</span>}
      </div>

      <Button
        disabled={loading}
        onClick={handleSubmit(onSubmit)}
        className="bg-[#D1AC2B] p-2 self-end mt-2"
      >
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
};
