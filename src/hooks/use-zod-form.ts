import { z } from "zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema>, "resolver"> & {
    schema: TSchema;
  },
) {
  const { schema } = props;
  const form = useForm<TSchema["_output"]>({
    ...props,
    resolver: zodResolver(schema),
  });

  return form;
}
