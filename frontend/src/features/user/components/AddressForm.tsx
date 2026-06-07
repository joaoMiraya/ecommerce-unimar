import { useState } from "react";
import { useAddressMutation, useCreateAddressMutation } from "../queries/user.query";
import type { FormDataProps, UserFormData } from "./ProfileForm";
import { Button } from "../../../components/Button";



export const AddressForm = ({ formData, setFormData }: FormDataProps) => {
    const [loading, setLoading] = useState(false);

    const [createAddress] = useCreateAddressMutation();
    const [updateAddress] = useAddressMutation();

    const hasAddress = !!formData.address.id;
    
    const setField = (field: keyof UserFormData["address"], value: string) =>
        setFormData((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));

    const handleUpdateAddress = async () => {
        setLoading(true);
        try {
        await updateAddress(formData.address);
        } catch {
        console.error("An error occurred");
        } finally {
        setLoading(false);
        }
    };

    const handleCreateAddress = async () => {
        setLoading(true);
        try {
        await createAddress(formData.address);
        } catch {
        console.error("An error occurred");
        } finally {
        setLoading(false);
        }
    };

  return (
    <div className="border p-2 mt-2 rounded-sm bg-slate-100 flex flex-col">
      <h2 className="text-xl">Seu endereço</h2>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="city">Cidade:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text" name="city"
          placeholder="Insira sua cidade"
          value={formData.address.city}
          onChange={(e) => setField("city", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="street">Rua:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text" name="street"
          placeholder="Insira sua rua"
          value={formData.address.street}
          onChange={(e) => setField("street", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="number">Número:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text" name="number"
          placeholder="Insira o número"
          value={formData.address.number}
          onChange={(e) => setField("number", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="neighborhood">Bairro:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text" name="neighborhood"
          placeholder="Insira seu bairro"
          value={formData.address.neighborhood}
          onChange={(e) => setField("neighborhood", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="zipCode">CEP:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text" name="zipCode"
          placeholder="Insira seu CEP"
          value={formData.address.zipCode}
          onChange={(e) => setField("zipCode", e.target.value)}
        />
      </div>

      {!hasAddress &&
        <Button
            disabled={loading}
            onClick={handleCreateAddress}
            className="bg-[#D1AC2B] p-2 self-end mt-2"
        >
            {loading ? "Salvando..." : "Salvar"}
        </Button>
      }
      {hasAddress &&
        <Button
            disabled={loading}
            onClick={handleUpdateAddress}
            className="bg-[#D1AC2B] p-2 self-end mt-2"
        >
            {loading ? "Atualizando..." : "Atualizar"}
        </Button>
      }
    </div>
  );
};