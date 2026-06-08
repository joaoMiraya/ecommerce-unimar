import { z } from "zod";

export const addressSchema = z.object({
  id: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  zipCode: z.string().min(8, "CEP deve ter pelo menos 8 caracteres"),
});

export const userInfoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

export const profileSchema = z.object({
  user: userInfoSchema,
  address: addressSchema,
});

export type ProfileFormData = z.infer<typeof profileSchema>;
