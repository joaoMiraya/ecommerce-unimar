import { useState } from "react";
import { useUpdateMutation } from "../queries/user.query";
import type { FormDataProps, UserFormData } from "./ProfileForm";
import { Button } from "../../../components/Button";



export const InfoForm = ({ formData, setFormData }: FormDataProps) => {
  const [loading, setLoading] = useState(false);
  const [updateInfo] = useUpdateMutation();

  const setField = (field: keyof UserFormData["user"], value: string) =>
    setFormData((prev) => ({ ...prev, user: { ...prev.user, [field]: value } }));

  const handleUpdateInfo = async () => {
    setLoading(true);
    try {
      await updateInfo(formData.user);
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
          name="name"
          placeholder="Insira seu nome"
          value={formData.user.name}
          onChange={(e) => setField("name", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="email">Email:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="email"
          name="email"
          value={formData.user.email}
          onChange={(e) => setField("email", e.target.value)}
        />
      </div>

      <Button
        disabled={loading}
        onClick={handleUpdateInfo}
        className="bg-[#D1AC2B] p-2 self-end mt-2"
      >
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
};