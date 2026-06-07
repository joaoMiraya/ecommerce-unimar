import { useState, type Dispatch, type SetStateAction } from "react"
import type { User } from "../types/user.types";
import { InfoForm } from "./InfoForm";
import { AddressForm } from "./AddressForm";

export interface ProfileFormProps {
  user: User;
}

export type UserFormData = {
  address: {
    id?: string;
    city?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    zipCode?: string;
  };
  user: {
    name: string;
    email: string;
  };
};

export const ProfileForm = ({ user }: ProfileFormProps) => {
    const [formData, setFormData] = useState<UserFormData>({
        address: {
        ...user.addresses?.[0]
        },
        user: {
        name: user.name,
        email: user.email,
        },
    });


    return (
        <form className="mt-4 flex flex-col">
          <InfoForm setFormData={setFormData} formData={formData} />
          <AddressForm setFormData={setFormData} formData={formData} />
        </form>
    );
};

export type FormDataProps = {
  setFormData: Dispatch<SetStateAction<UserFormData>>;
  formData: UserFormData;
};
