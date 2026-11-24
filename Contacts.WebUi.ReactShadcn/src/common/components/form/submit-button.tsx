import type { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';
import { RefreshCwIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button, type buttonVariants } from '#/common/components/ui/button';

type SubmittingForm = {
  Subscribe: (props: {
    selector: (state: { isSubmitting: boolean }) => boolean;
    children: (isSubmitting: boolean) => ReactNode;
  }) => ReactNode | Promise<ReactNode>;
  formId: string;
};

type SubmitButtonProps = Omit<ButtonPrimitive.Props, 'type' | 'form'> &
  VariantProps<typeof buttonVariants> & {
    formApi: SubmittingForm;
    label?: string;
  };

/**
 * Submit button to use with TanStack form outside <form> tag.
 * Requires setting form id as <form id={form.formId}>.
 * @param param0
 * @param param0.formApi the form to bind the button to
 */
export function SubmitButton({
  formApi,
  label = 'Save',
  ...props
}: SubmitButtonProps) {
  return (
    <formApi.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          className="min-w-btn"
          {...props}
          disabled={isSubmitting || props.disabled}
          form={formApi.formId}
          type="submit"
          aria-busy={isSubmitting}
          aria-label={label}
        >
          {isSubmitting ? (
            <RefreshCwIcon
              size="20"
              className="animate-spin"
              aria-hidden="true"
            />
          ) : (
            label
          )}
        </Button>
      )}
    </formApi.Subscribe>
  );
}
