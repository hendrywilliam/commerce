"use client";
import {
  Form,
  FormField,
  FormInput,
  FormLabel,
  FormTextarea,
  FormMessage,
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
    try {
      await createNewStoreAction({
        description: data.description,
        name: data.name,
      });
      toast.success("A new store created.");
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading((isLoading) => !isLoading);
      formRef.current?.reset();
    }
  });

  return (
    <div className="mt-4">
      <Form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-2">
        <FormField>
          <FormLabel>Store Name</FormLabel>
          <FormInput {...register("name")} />
          <FormMessage>
            Your store unique identifier. Users can see this.
          </FormMessage>
        </FormField>
        <FormField>
          <FormLabel>Description</FormLabel>
          <FormTextarea
            rows={1}
            cols={1}
            className="h-52"
            {...register("description")}
          />
          <FormMessage>
            Describe your store in simple words. Users can see this.
          </FormMessage>
        </FormField>
        <FormField className="mt-4">
          <Button
            className="gap-1 disabled:opacity-75"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <IconLoading />}
            Add New Store
          </Button>
        </FormField>
      </Form>
    </div>
  );
}
