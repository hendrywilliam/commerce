"use client";
import {
  Form,
  FormField,
  FormInput,
  FormLabel,
  FormTextarea,
} from "@/components/ui/form";
import { createNewStore } from "@/actions/stores/create-new-store";
import { useZodForm } from "@/hooks/use-zod-form";
import { addNewStoreValidation } from "@/lib/validations/stores";
import { Button } from "@/components/ui/button";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { IconLoading } from "@/components/ui/icons";

export default function CreateNewStoreForm() {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
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
      name: data.name,
      active: true,
    })
      .then((res) => {
        toast("Success add a new store.");
      })
      .catch((err) => {
        toast.error("Something went wrong, please try again later.");
      })
      .finally(() => {
        void setIsLoading(false);
        formRef.current?.reset();
      });
  });

  return (
    <div className="mt-4">
      <Form ref={formRef} onSubmit={onSubmit}>
        <FormField>
          <FormLabel>Store Name</FormLabel>
          <FormInput {...register("name")} />
          <FormLabel>Description</FormLabel>
          <FormTextarea
            rows={1}
            cols={1}
            className="h-52"
            {...register("description")}
          />
          <Button className="gap-1" type="submit">
            {isLoading && <IconLoading />}
            Submit
          </Button>
        </FormField>
      </Form>
    </div>
  );
}
