import ProductList from "./components/ProductList"
import ProductAdd from "./components/ProductAdd.jsx";
import {Routes,Route} from "react-router-dom";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="*" element={<ProductList />}/>
                <Route path="/add" element={<ProductAdd />}/>
            </Routes>
        </>
    );
}