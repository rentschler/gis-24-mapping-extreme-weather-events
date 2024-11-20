import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Map from "./Map";

const queryClient = new QueryClient();
const App = () => <QueryClientProvider client={queryClient}><Map /></QueryClientProvider>;

export default App;
