import { useSelector } from '@tanstack/react-form';
import type { useFieldContext } from '#/common/components/form/form-field-contexts';

/**
 * Returns field errors and showErrors flag indicating whether the errors and field's invalid state should be rendered.
 * In combination with form's onChange validation, using showErrors flag results in field error state changing as user
 * types, but not until the field is blurred for the first time or form submission attempt is made.
 */
export function useFieldErrors<TData>(
  field: ReturnType<typeof useFieldContext<TData>>,
) {
  const { invalid, blurred, touched, errors } = useSelector(
    field.store,
    (state) => ({
      invalid: !state.meta.isValid,
      blurred: state.meta.isBlurred,
      touched: state.meta.isTouched,
      errors: state.meta.errors,
    }),
  );

  const submissionAttempts = useSelector(
    field.form.store,
    (state) => state.submissionAttempts,
  );

  return {
    errors,
    showErrors: invalid && (blurred || (touched && submissionAttempts > 0)),
  };
}
