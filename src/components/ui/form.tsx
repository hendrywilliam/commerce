import {
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  forwardRef,
  TextareaHTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

//form root interfaces
export interface Form extends FormHTMLAttributes<HTMLFormElement> {}

type FormRef = HTMLFormElement;

export const Form = forwardRef<FormRef, Form>((props, ref) => {
  return (
    <form {...props} ref={ref}>
      {props.children}
    </form>
  );
});

Form.displayName = "Form";

//form field interfaces
export interface FormField
  extends FormHTMLAttributes<HTMLFieldSetElement>,
    VariantProps<typeof formFieldVariants> {}

type FormFieldRef = HTMLFieldSetElement;

const formFieldVariants = cva("flex flex-col gap-2");

export const FormField = forwardRef<FormFieldRef, FormField>(
  ({ className, ...props }, ref) => {
    return (
      <fieldset
        className={cn(formFieldVariants({ class: className }))}
        {...props}
        ref={ref}
      >
        {props.children}
      </fieldset>
    );
  }
);

FormField.displayName = "FormField";

//form label interfaces
export interface FormLabel
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof formLabelVariant> {}

const formLabelVariant = cva("font-normal");

type FormLabelRef = HTMLLabelElement;

export const FormLabel = forwardRef<FormLabelRef, FormLabel>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(formLabelVariant({ class: className }))}
        {...props}
      >
        {props.children}
      </label>
    );
  }
);

FormLabel.displayName = "FormLabel";

//form input interfaces
export interface FormInput
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size">,
    FormInputVariant {}

type FormInputRef = HTMLInputElement;

//form input variant
const formInputVariant = cva("p-2 rounded-md", {
  variants: {
    variant: {
      default:
        "border focus:ring-2 ring-muted outline-none disabled:opacity-75 bg-transparent",
      error:
        "border focus:ring-2 ring-1 ring-destructive ring-offset-1 outline-none",
    },
    size: {
      default: "h-9 px-2 py-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type FormInputVariant = VariantProps<typeof formInputVariant>;

export const FormInput = forwardRef<FormInputRef, FormInput>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <input
        className={cn(formInputVariant({ variant, size, className }))}
        {...props}
        ref={ref}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export interface FormMessage
  extends Omit<HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof formMessageVariant> {
  custom?: string;
}

type FormMessageRef = HTMLParagraphElement;

const formMessageVariant = cva("text-base mt-2", {
  variants: {
    variant: {
      error: "text-destructive text-sm",
      muted: "text-muted text-sm",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
});

export const FormMessage = forwardRef<FormMessageRef, FormMessage>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <p
        className={cn(
          formMessageVariant({
            variant,
            size,
            className,
          })
        )}
        {...props}
      >
        {props.children}
      </p>
    );
  }
);

FormMessage.displayName = "FormMessage";

//form textarea
export interface FormTextarea
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    FormTextareaVariants {}

type FormTextareaRef = HTMLTextAreaElement;

const formTextVariants = cva(
  "border rounded-md resize-none p-2 text-sm focus:ring-2 ring-muted outline-none bg-transparent"
);

type FormTextareaVariants = VariantProps<typeof formTextVariants>;

export const FormTextarea = forwardRef<FormTextareaRef, FormTextarea>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(formTextVariants({ class: className }))}
        {...props}
        ref={ref}
      >
        {props.children}
      </textarea>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
