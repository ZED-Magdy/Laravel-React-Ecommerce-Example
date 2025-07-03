import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { LoginPage } from '../pages/LoginPage';
import { ProductsListPage } from '../pages/ProductsListPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { CartPage } from '../pages/CartPage';

export const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductsListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/order/:orderId" element={<OrderDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};