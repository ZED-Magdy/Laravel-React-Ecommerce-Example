import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { LoginPage } from '../pages/LoginPage';
import { ProductsListPage } from '../pages/ProductsListPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { CartPage } from '../pages/CartPage';
import { AuthProvider } from '../contexts/AuthContext';
import { CategoriesProvider } from '../contexts/CategoriesContext';
import { CartProvider } from '../contexts/CartContext';

export const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
              <Route path="/" element={
                <CategoriesProvider>
                  <ProductsListPage />
                </CategoriesProvider>
              } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/order/:orderId" element={<OrderDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};