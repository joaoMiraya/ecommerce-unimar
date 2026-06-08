import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../types/user.types";
import { InfoForm } from "./InfoForm";
import { AddressForm } from "./AddressForm";
import { profileSchema, type ProfileFormData } from "../schemas/profile.schema";

export interface ProfileFormProps {
  user: User;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      address: { ...user.addresses?.[0] },
      user: { name: user.name, email: user.email },
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="mt-4 flex flex-col">
        <InfoForm />
        <AddressForm />
      </form>
    </FormProvider>
  );
};
