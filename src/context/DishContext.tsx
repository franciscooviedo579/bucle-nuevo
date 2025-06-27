import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dish } from '../types';
import { mockDishes } from '../data/mockData';

interface DishContextType {
  dishes: Dish[];
  addDish: (dish: Omit<Dish, 'id'>) => void;
  updateDish: (id: string, dish: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  getDishById: (id: string) => Dish | undefined;
}

const DishContext = createContext<DishContextType | undefined>(undefined);

export const DishProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<Dish[]>(mockDishes);

  const addDish = (dishData: Omit<Dish, 'id'>) => {
    const newDish: Dish = {
      ...dishData,
      id: Date.now().toString()
    };
    setDishes(prev => [...prev, newDish]);
  };

  const updateDish = (id: string, dishData: Partial<Dish>) => {
    setDishes(prev => prev.map(dish => 
      dish.id === id ? { ...dish, ...dishData } : dish
    ));
  };

  const deleteDish = (id: string) => {
    setDishes(prev => prev.filter(dish => dish.id !== id));
  };

  const getDishById = (id: string) => {
    return dishes.find(dish => dish.id === id);
  };

  return (
    <DishContext.Provider value={{
      dishes,
      addDish,
      updateDish,
      deleteDish,
      getDishById
    }}>
      {children}
    </DishContext.Provider>
  );
};

export const useDishes = () => {
  const context = useContext(DishContext);
  if (context === undefined) {
    throw new Error('useDishes must be used within a DishProvider');
  }
  return context;
};