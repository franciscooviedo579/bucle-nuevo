import { Dish } from '../types';

export const mockDishes: Dish[] = [
  {
    id: '1',
    title: 'Pizza Margherita',
    description: 'Pizza clásica con salsa de tomate, mozzarella fresca y albahaca',
    price: 12.99,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pizzas',
    available: true
  },
  {
    id: '2',
    title: 'Hamburguesa Deluxe',
    description: 'Hamburguesa con carne premium, queso cheddar, lechuga, tomate y papas fritas',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Hamburguesas',
    available: true
  },
  {
    id: '3',
    title: 'Pasta Carbonara',
    description: 'Pasta cremosa con panceta, huevo, queso parmesano y pimienta negra',
    price: 13.50,
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pastas',
    available: true
  },
  {
    id: '4',
    title: 'Ensalada César',
    description: 'Lechuga romana, crutones, queso parmesano y aderezo césar',
    price: 9.99,
    image: 'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Ensaladas',
    available: true
  },
  {
    id: '5',
    title: 'Sushi Roll',
    description: 'Roll de salmón con aguacate, pepino y salsa teriyaki',
    price: 18.99,
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Sushi',
    available: true
  },
  {
    id: '6',
    title: 'Tacos al Pastor',
    description: 'Tres tacos con carne al pastor, piña, cebolla y cilantro',
    price: 11.99,
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Mexicana',
    available: true
  }
];

export const restaurantInfo = {
  name: 'Sabores Únicos',
  phone: '+1234567890',
  address: 'Calle Principal 123, Ciudad',
  whatsappNumber: '+5493405500324'
};