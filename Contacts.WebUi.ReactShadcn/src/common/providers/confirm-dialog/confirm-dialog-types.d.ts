export type ConfirmOptions = {
  title?: string;
  message?: string;
  yesText?: string;
  noText?: string;
  yesVariant?: 'default' | 'destructive';
};

export type ConfirmFunction = (options?: ConfirmOptions) => Promise<boolean>;
