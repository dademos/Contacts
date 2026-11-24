import { useId } from 'react';
import { useFieldErrors } from '#/common/components/form/fields/use-field-errors';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#/common/components/ui/field';
import { Input } from '#/common/components/ui/input';
import { useFieldContext } from '../form-field-contexts';

type TextFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'onBlur' | 'aria-invalid' | 'aria-describedby'
> & {
  label: string;
  description?: string;
};

export function TextField({
  label,
  description,
  ...inputProps
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const { errors, showErrors } = useFieldErrors(field);
  const id = useId();
  const inputId = inputProps.id || id;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const describedBy =
    [description && descriptionId, showErrors && errorId]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <Field data-invalid={showErrors}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <Input
        type="text"
        {...inputProps}
        id={inputId}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.currentTarget.value)}
        onBlur={field.handleBlur}
        aria-invalid={showErrors}
        aria-describedby={describedBy}
      />
      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
      {showErrors && <FieldError id={errorId} errors={errors} />}
    </Field>
  );
}
