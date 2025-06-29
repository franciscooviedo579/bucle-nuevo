import React, { useState } from 'react';
import DishCard from '../components/DishCard';
import { useDishes } from '../context/DishContext';

const Menu: React.FC = () => {
  const { dishes } = useDishes();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  
  const categories = ['Todos', ...Array.from(new Set(dishes.map(dish => dish.category)))];
  const filteredDishes = selectedCategory === 'Todos' 
    ? dishes 
    : dishes.filter(dish => dish.category === selectedCategory);

  return (
    <div className="min-h-screen bg-balck">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Menú</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestros deliciosos platos preparados con ingredientes frescos y mucho amor
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDishes.map(dish => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay platos disponibles en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;