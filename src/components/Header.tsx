import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="bg-black shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors">
            <UtensilsCrossed className="h-8 w-8" />
            <span className="text-xl font-bold">Bucle</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-orange-600 transition-colors font-medium"
            >
              Menú
            </Link>

            <Link 
              to="/cart" 
              className="relative text-white hover:text-orange-600 transition-colors flex items-center space-x-1"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
              <span className="hidden sm:inline">Carrito</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
