import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SimpleNavbar from "./components/navbar/SimpleNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SimpleFooter from "./components/footer/SimpleFooter";
import MapWrapper from "./pages/MapWrapper";

const queryClient = new QueryClient();
const App = () =>
    <QueryClientProvider client={queryClient}>
        <div className="app-container">
            <SimpleNavbar />
                <MapWrapper />
            <SimpleFooter />
        </div>

    </QueryClientProvider>;

export default App;
