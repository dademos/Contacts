import { createFormHook } from '@tanstack/react-form';
import {
  fieldContext,
  formContext,
} from '#/common/components/form/form-field-contexts';
import { TextField } from './fields/text-field';
import { SubmitButton } from './submit-button';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: { SubmitButton },
});
