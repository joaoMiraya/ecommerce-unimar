import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAddressMutation, useCreateAddressMutation } from "../queries/user.query";
import { Button } from "../../../components/Button";
import type { ProfileFormData } from "../schemas/profile.schema";

export const AddressForm = () => {
  const [loading, setLoading] = useState(false);
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useAddressMutation();
  const { register, handleSubmit, watch, formState: { errors } } = useFormContext<ProfileFormData>();

  const hasAddress = !!watch("address.id");

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      if (hasAddress) {
        await updateAddress(data.address);
      } else {
        await createAddress(data.address);
      }
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
          type="text"
          placeholder="Insira sua cidade"
          {...register("address.city")}
        />
        {errors.address?.city && <span className="text-red-500 text-xs">{errors.address.city.message}</span>}
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="street">Rua:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text"
          placeholder="Insira sua rua"
          {...register("address.street")}
        />
        {errors.address?.street && <span className="text-red-500 text-xs">{errors.address.street.message}</span>}
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="number">Número:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text"
          placeholder="Insira o número"
          {...register("address.number")}
        />
        {errors.address?.number && <span className="text-red-500 text-xs">{errors.address.number.message}</span>}
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="neighborhood">Bairro:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text"
          placeholder="Insira seu bairro"
          {...register("address.neighborhood")}
        />
        {errors.address?.neighborhood && <span className="text-red-500 text-xs">{errors.address.neighborhood.message}</span>}
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-zinc-900 font-bold" htmlFor="zipCode">CEP:</label>
        <input
          className="border border-zinc-900 rounded-sm p-1"
          type="text"
          placeholder="Insira seu CEP"
          {...register("address.zipCode")}
        />
        {errors.address?.zipCode && <span className="text-red-500 text-xs">{errors.address.zipCode.message}</span>}
      </div>

      <Button
        disabled={loading}
        onClick={handleSubmit(onSubmit)}
        className="bg-[#D1AC2B] p-2 self-end mt-2"
      >
        {loading ? (hasAddress ? "Atualizando..." : "Salvando...") : (hasAddress ? "Atualizar" : "Salvar")}
      </Button>
    </div>
  );
};
