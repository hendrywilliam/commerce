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
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { IconLoading } from "@/components/ui/icons";
import { ElementRef, FormEvent, useRef, useState } from "react";
import { updateOwnedStoreAction } from "@/actions/stores/update-store";
import { createNewStoreAction } from "@/actions/stores/create-new-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StoreFormProps {
  storeStatus: "new-store" | "existing-store";
  initialValue?: Pick<Store, "name" | "description" | "id">;
}

export default function StoreFormDialog({
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
    if (storeStatus === "new-store") {
      return toast.promise(
        createNewStoreAction({
          name: storeData.name,
          description: storeData.description,
        }),
        {
          loading: "Adding a new store...",
          success: () => "A new store created.",
          error: (error) => catchError(error),
          finally: () => setIsLoading(false),
        },
      );
    } else {
      return toast.promise(
        updateOwnedStoreAction({
          id: storeData.id as number,
          name: storeData.name,
          description: storeData.description,
        }),
        {
          loading: "Updating your store...",
          success: () => "Your store has been updated.",
          error: (error) => catchError(error),
          finally: () => setIsLoading(false),
        },
      );
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={storeStatus === "new-store" ? "sm" : "icon"}
        >
          {storeStatus === "new-store" ? "New Store" : <Pencil2Icon />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {storeStatus === "new-store" ? "Create New Store" : "Update Store"}
          </DialogTitle>
        </DialogHeader>
        <Form
          ref={formRef}
          onSubmit={(event) => onSubmit(event)}
          className="mt-4 flex flex-col space-y-4 text-sm"
        >
          <FormField>
            <FormLabel htmlFor="store-name">Store Name</FormLabel>
            <FormInput
              name="name"
              className="w-full"
              value={storeData["name"]}
              autoComplete="off"
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
              className="h-52 w-full"
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
          <FormField>
            <Button
              className="flex w-max gap-2"
              type="submit"
              disabled={isLoading}
            >
              Submit
              {isLoading && <IconLoading />}
            </Button>
          </FormField>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
