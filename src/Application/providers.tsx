import "react-material-symbols/rounded";

import { BrowserRouter } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { QueryCrudClientProvider } from "react-query-crud";
import { UIProvider } from "../ui";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 500,
    },
  },
});

const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => (
  <UIProvider>
    <QueryCrudClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryCrudClientProvider>
  </UIProvider>
);

export default ProvidersWrapper;