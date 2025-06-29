import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { DishProvider } from './context/DishContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <DishProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 background black">
              <Header />
              <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </DishProvider>
    </AuthProvider>
  );
}

export default App;