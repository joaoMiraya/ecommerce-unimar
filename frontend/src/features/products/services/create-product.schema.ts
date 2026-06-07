import { z } from "zod";

export const createProductSchema = z.object({
    name: z
        .string()
        .min(3, "Nome deve possuir pelo menos 3 caracteres"),

    description: z
        .string()
        .min(5, "Descrição deve possuir pelo menos 5 caracteres"),

    price: z
        .number()
        .positive("Preço deve ser maior que zero"),

    stock: z
        .number()
        .int("Quantidade deve ser um número inteiro")
        .min(1, "Quantidade deve ser maior que 0"),
});

export type CreateProductForm = z.infer<typeof createProductSchema>;