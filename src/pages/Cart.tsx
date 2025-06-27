import React, { useState } from 'react';
import { Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CustomerInfo } from '../types';
import { restaurantInfo } from '../data/mockData';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const generateWhatsAppMessage = () => {
    let message = `🍽️ *Nueva Orden - ${restaurantInfo.name}*\n\n`;
    message += `👤 *Cliente:* ${customerInfo.name}\n`;
    message += `📞 *Teléfono:* ${customerInfo.phone}\n`;
    if (customerInfo.address) {
      message += `📍 *Dirección:* ${customerInfo.address}\n`;
    }
    message += `\n📝 *Pedido:*\n`;
    
    cart.items.forEach(item => {
      message += `• ${item.dish.title} x${item.quantity} - $${(item.dish.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n💰 *Total: $${cart.total.toFixed(2)}*\n`;
    
    if (customerInfo.notes) {
      message += `\n📋 *Notas:* ${customerInfo.notes}`;
    }
    
    return encodeURIComponent(message);
  };

  const handleSendOrder = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${restaurantInfo.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    setCustomerInfo({ name: '', phone: '', address: '', notes: '' });
    setShowCheckout(false);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega algunos platos deliciosos a tu orden</p>
          <button
            onClick={() => window.history.back()}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Ver Menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu Carrito</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              {cart.items.map(item => (
                <div key={item.dish.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                  <img 
                    src={item.dish.image} 
                    alt={item.dish.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.dish.title}</h3>
                    <p className="text-gray-600 text-sm">${item.dish.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                      className="bg-green-500 hover:bg-green-600 text-white p-1 rounded transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.dish.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.dish.id)}
                      className="text-red-500 hover:text-red-700 transition-colors mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-orange-600">${cart.total.toFixed(2)}</span>
                </div>
              </div>
              
              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Proceder al Pedido</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Información del Cliente</h3>
                  
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre completo"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Número de teléfono"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  
                  <input
                    type="text"
                    name="address"
                    placeholder="Dirección (opcional)"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  
                  <textarea
                    name="notes"
                    placeholder="Notas adicionales (opcional)"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleSendOrder}
                      disabled={!customerInfo.name || !customerInfo.phone}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Enviar por WhatsApp</span>
                    </button>
                    
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;