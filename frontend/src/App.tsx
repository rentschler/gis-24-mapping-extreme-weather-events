import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Map from "./Map";
import SimpleNavbar from "./components/navbar/SimpleNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient();
const App = () => 
<QueryClientProvider client={queryClient}>
    <>
        <SimpleNavbar />
        <Map />
    </>

</QueryClientProvider>;

export default App;
