"use client";
import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";
import { createNewStore } from "@/actions/stores/create-new-store";
import { useZodForm } from "@/hooks/use-zod-form";
import { addNewStoreValidation } from "@/lib/validations/stores";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateNewStoreForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: addNewStoreValidation,
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit(async function (data) {
    setIsLoading(true);
    await createNewStore({
      description: data.description,
      storeName: data.storeName,
    })
      .then((res) => {
        toast("Success add a new store.");
      })
      .catch((err) => {
        toast.error("Something went wrong, please try again later.");
      })
      .finally(() => void setIsLoading(false));
  });

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <FormField>
          <FormLabel>Description</FormLabel>
          <FormInput {...register("description")} />
          <FormLabel>Store Name</FormLabel>
          <FormInput {...register("storeName")} />
          <Button type="submit">Submit</Button>
        </FormField>
      </Form>
    </div>
  );
}
