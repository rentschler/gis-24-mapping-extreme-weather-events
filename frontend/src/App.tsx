import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Map from "./pages/Map";
import SimpleNavbar from "./components/navbar/SimpleNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SimpleFooter from "./components/footer/SimpleFooter";

const queryClient = new QueryClient();
const App = () =>
    <QueryClientProvider client={queryClient}>
        <div className="app-container">
            <SimpleNavbar />
            <Map />
            <SimpleFooter />
        </div>

    </QueryClientProvider>;

export default App;
