"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { NewAddress } from "@/db/schema";
import { catchError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useZodForm } from "@/hooks/use-zod-form";
import type { FieldErrors } from "react-hook-form";
import { IconLoading } from "@/components/ui/icons";
import { newAddressValidation } from "@/lib/validations/address";
import { addNewAddressAction } from "@/actions/addresses/add-new-address";
import { Form, FormField, FormInput, FormLabel } from "@/components/ui/form";

export default function AddNewAddressForm() {
  const [isPending, startTransition] = useTransition();

  const form = useZodForm({ schema: newAddressValidation, mode: "onSubmit" });

  function onError(error: FieldErrors<typeof newAddressValidation>) {
    const firstErrorInErrorList = Object.values(error)[0];
    toast.error(String(firstErrorInErrorList.message));
  }

  function onSubmit(data: NewAddress) {
    startTransition(async () => {
      await addNewAddressAction(data)
        .then(() => {
          toast.success("New address has been added.");
        })
        .catch((err) => {
          catchError(err);
        });
    });
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <Form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-2"
      >
        <FormField>
          <FormLabel htmlFor="line1-input">Line 1</FormLabel>
          <FormInput
            variant={form.formState.errors["line1"] ? "error" : "default"}
            {...form.register("line1")}
            id="line1-input"
            name="line1"
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="line2-input">Line 2</FormLabel>
          <FormInput
            {...form.register("line2")}
            id="line2-input"
            name="line2"
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="city-input">City</FormLabel>
          <FormInput
            variant={form.formState.errors["city"] ? "error" : "default"}
            {...form.register("city")}
            id="city-input"
            name="city"
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="state-input">State</FormLabel>
          <FormInput
            variant={form.formState.errors["state"] ? "error" : "default"}
            {...form.register("state")}
            id="state-input"
            name="state"
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="country-input">Country</FormLabel>
          <FormInput
            variant={form.formState.errors["country"] ? "error" : "default"}
            {...form.register("country")}
            id="country-input"
            name="country"
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="postalcode-input">Postal Code</FormLabel>
          <FormInput
            variant={form.formState.errors["postal_code"] ? "error" : "default"}
            {...form.register("postal_code")}
            id="postalcode-input"
            name="postalcode"
          />
        </FormField>
        <FormField className="mt-8">
          <Button
            disabled={isPending}
            aria-disabled={isPending ? "true" : "false"}
            type="submit"
            className="inline-flex gap-2"
          >
            {isPending && <IconLoading />}
            Add new address
          </Button>
        </FormField>
      </Form>
    </div>
  );
}
