import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Dish } from '../types';
import { useCart } from '../context/CartContext';

interface DishCardProps {
  dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { cart, addItem, updateQuantity } = useCart();
  
  const cartItem = cart.items.find(item => item.dish.id === dish.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(dish);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(dish.id, newQuantity);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img 
          src={dish.image} 
          alt={dish.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{dish.title}</h3>
          <span className="text-2xl font-bold text-orange-600">${dish.price.toFixed(2)}</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{dish.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
            {dish.category}
          </span>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 font-medium"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Agregar</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleUpdateQuantity(quantity - 1)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleUpdateQuantity(quantity + 1)}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;