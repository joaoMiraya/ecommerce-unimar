import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../components/Button";
import { formatCurrency, parseCurrency } from "../../../services/formatters";
import { useCreateMutation } from "../queries/product.query";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductForm } from "../services/create-product.schema";

export const CreateProduct = () => {
    const [createProduct] = useCreateMutation();

    const [priceInput, setPriceInput] = useState(
        formatCurrency(0)
    );

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateProductForm>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
        },
    });

    const onSubmit = async (data: CreateProductForm) => {
        try {
            await createProduct(data).unwrap();

            reset();

            setPriceInput(formatCurrency(0));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl">
                Adicione seus produtos
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col">
                    <label>Nome</label>

                    <input
                        {...register("name")}
                        className="border rounded-sm p-1"
                        placeholder="Insira o nome"
                    />

                    {errors.name && (
                        <span className="text-red-500 text-sm">
                            {errors.name.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label>Descrição</label>

                    <input
                        {...register("description")}
                        className="border rounded-sm p-1"
                        placeholder="Insira a descrição"
                    />

                    {errors.description && (
                        <span className="text-red-500 text-sm">
                            {errors.description.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label>Preço</label>

                    <Controller
                        control={control}
                        name="price"
                        render={({ field }) => (
                            <input
                                type="text"
                                value={priceInput}
                                className="border rounded-sm p-1"
                                placeholder="R$ 0,00"
                                onChange={(e) => {
                                    const value =
                                        parseCurrency(
                                            e.target.value
                                        );

                                    setPriceInput(
                                        formatCurrency(value)
                                    );

                                    field.onChange(value);
                                }}
                            />
                        )}
                    />

                    {errors.price && (
                        <span className="text-red-500 text-sm">
                            {errors.price.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label>Quantidade</label>

                    <input
                        type="number"
                        {...register("stock", {
                            valueAsNumber: true,
                        })}
                        className="border rounded-sm p-1"
                    />

                    {errors.stock && (
                        <span className="text-red-500 text-sm">
                            {errors.stock.message}
                        </span>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#D1AC2B] p-2 self-end text-slate-50"
                >
                    Adicionar
                </Button>
            </form>
        </div>
    );
};