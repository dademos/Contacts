import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { tableDevtoolsPlugin } from '@tanstack/react-table-devtools';
import { Toaster } from '#/common/components/ui/toast';
import { TooltipProvider } from '#/common/components/ui/tooltip';
import { queryClient } from '#/common/lib/query-client/query-client';
import { ConfirmDialogProvider } from '#/common/providers/confirm-dialog/confirm-dialog-provider';
import { getRouter } from '#/router';

const router = getRouter();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ConfirmDialogProvider>
          <RouterProvider router={router} />

          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel router={router} />,
              },
              {
                name: 'TanStack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
              formDevtoolsPlugin(),
              tableDevtoolsPlugin(),
            ]}
          />
        </ConfirmDialogProvider>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
