import type { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';
import { Button, type buttonVariants } from '#/common/components/ui/button';
import { DialogClose } from '#/common/components/ui/dialog';

type DialogCloseButtonProps = Omit<ButtonPrimitive.Props, 'type' | 'form'> &
  VariantProps<typeof buttonVariants> & {
    label?: string;
  };

export function DialogCloseButton({
  label = 'Cancel',
  ...props
}: DialogCloseButtonProps) {
  return (
    <DialogClose
      render={
        <Button
          type="button"
          variant="outline"
          className="min-w-btn"
          {...props}
        />
      }
    >
      {label}
    </DialogClose>
  );
}
