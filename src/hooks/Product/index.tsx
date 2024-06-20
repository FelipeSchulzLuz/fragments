import { createContext, useContext, useState } from "react";
import ProductService from "../../../service/productService"; // Mock

export interface ProductModel {
    productCode: number;
    productName: string;
    supplierCode: number;
}

interface ProductContextProps {
    products: ProductModel[];
    getProducts: (supplierCode: number, productCode?: number) => void;
    loadingProduct: boolean;
    hasSearched: boolean;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

type ProductsProviderProps = ProductContextProps & {
    children: React.ReactNode;
};

const ProductsProvider = ({ children }: ProductsProviderProps) => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const getProducts = async (supplierCode: number, productCode?: number) => {
        setLoadingProduct(true);
        try {
            const products = await ProductService.fetchVisitedProducts(
                supplierCode,
                productCode
            );
            setProducts(products?.products || []);
            setHasSearched(true);
            setLoadingProduct(false);
        } catch (e) {
            console.log(e);
            setProducts([]);
            setLoadingProduct(false);
        }
    };

    return (
        <ProductContext.Provider
            value={{ products, getProducts, loadingProduct, hasSearched }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProductsContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error(
            "useProductsContext must be used within a ProductsProvider"
        );
    }
    return context;
};

export default ProductsProvider;