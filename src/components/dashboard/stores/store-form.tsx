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
import { Store } from "@/db/schema";
import { catchError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { ElementRef, FormEvent, useRef, useState } from "react";
import { updateOwnedStoreAction } from "@/actions/stores/update-store";
import { createNewStoreAction } from "@/actions/stores/create-new-store";

interface StoreFormProps {
  storeStatus: "new-store" | "existing-store";
  initialValue?: Pick<Store, "name" | "description" | "id">;
}

export default function StoreForm({
  initialValue,
  storeStatus,
}: StoreFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const [storeData, setStoreData] = useState<
    Pick<Store, "name" | "description"> & { id?: number }
  >(initialValue ?? { name: "", description: "" });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (storeStatus === "new-store") {
        await createNewStoreAction({
          name: storeData.name,
          description: storeData.description,
        });
        toast.success("A new store created.");
      } else {
        await updateOwnedStoreAction({
          id: storeData.id as number,
          name: storeData.name,
          description: storeData.description,
        });
        toast.success("Store updated.");
      }
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading((isLoading) => !isLoading);
      formRef.current?.reset();
    }
  }

  return (
    <Form
      ref={formRef}
      onSubmit={(event) => onSubmit(event)}
      className="flex flex-col gap-2 mt-4"
    >
      <FormField>
        <FormLabel htmlFor="store-name">Store Name</FormLabel>
        <FormInput
          name="name"
          className="w-full lg:w-1/2"
          value={storeData["name"]}
          onChange={(e) =>
            setStoreData({
              ...storeData,
              [e.target.name]: e.target.value,
            })
          }
          id="store-name"
        />
        <FormMessage>
          Your store unique identifier. Users can see this.
        </FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Description</FormLabel>
        <FormTextarea
          rows={1}
          cols={1}
          name="description"
          className="w-full lg:w-1/2 h-52"
          value={storeData["description"]}
          onChange={(e) =>
            setStoreData({
              ...storeData,
              [e.target.name]: e.target.value,
            })
          }
        />
        <FormMessage>
          Describe your store in simple words. Users can see this.
        </FormMessage>
      </FormField>
      <FormField className="mt-4">
        <Button
          className="gap-1 disabled:opacity-75 w-full lg:w-1/2"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <IconLoading />}
          {storeStatus === "new-store" ? "Add New Store" : "Update Store"}
        </Button>
      </FormField>
    </Form>
  );
}
