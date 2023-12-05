"use client";
import {
  Form,
  FormField,
  FormInput,
  FormLabel,
  FormTextarea,
} from "@/components/ui/form";
import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useZodForm } from "@/hooks/use-zod-form";
import { IconLoading } from "@/components/ui/icons";
import { ElementRef, useRef, useState } from "react";
import { storeValidation } from "@/lib/validations/stores";
import { createNewStoreAction } from "@/actions/stores/create-new-store";

export default function CreateNewStoreForm() {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: storeValidation,
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit(async function (data) {
    setIsLoading(true);
    await createNewStoreAction({
      description: data.description,
      name: data.name,
    })
      .then((res) => {
        toast("Success add a new store.");
      })
      .catch((err) => {
        catchError(err);
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
          <Button
            className="gap-1 disabled:opacity-75"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <IconLoading />}
            Submit
          </Button>
        </FormField>
      </Form>
    </div>
  );
}
