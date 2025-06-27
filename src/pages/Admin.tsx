import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, LogOut, User, Settings, Key, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useDishes } from '../context/DishContext';
import { useAuth } from '../context/AuthContext';
import { Dish } from '../types';

const Admin: React.FC = () => {
  const { dishes, addDish, updateDish, deleteDish } = useDishes();
  const { user, logout, updateAccount } = useAuth();
  const [activeTab, setActiveTab] = useState<'dishes' | 'account'>('dishes');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    available: true
  });

  // Account settings state
  const [accountData, setAccountData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountMessage, setAccountMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      image: '',
      category: '',
      available: true
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const resetAccountForm = () => {
    setAccountData({
      username: user?.username || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setAccountMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
    setAccountMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dishData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    if (isCreating) {
      addDish(dishData);
    } else if (editingId) {
      updateDish(editingId, dishData);
    }
    
    resetForm();
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountMessage(null);

    // Validaciones
    if (!accountData.currentPassword) {
      setAccountMessage({ type: 'error', text: 'La contraseña actual es requerida' });
      return;
    }

    if (accountData.newPassword && accountData.newPassword !== accountData.confirmPassword) {
      setAccountMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    if (accountData.newPassword && accountData.newPassword.length < 6) {
      setAccountMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }

    if (!accountData.username.trim()) {
      setAccountMessage({ type: 'error', text: 'El nombre de usuario es requerido' });
      return;
    }

    if (!accountData.email.trim() || !accountData.email.includes('@')) {
      setAccountMessage({ type: 'error', text: 'Ingresa un email válido' });
      return;
    }

    setIsUpdatingAccount(true);

    try {
      const success = await updateAccount({
        username: accountData.username.trim(),
        email: accountData.email.trim(),
        currentPassword: accountData.currentPassword,
        newPassword: accountData.newPassword || undefined
      });

      if (success) {
        setAccountMessage({ type: 'success', text: 'Cuenta actualizada exitosamente' });
        setAccountData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setAccountMessage({ type: 'error', text: 'Contraseña actual incorrecta o nombre de usuario ya existe' });
      }
    } catch (error) {
      setAccountMessage({ type: 'error', text: 'Error al actualizar la cuenta. Intenta nuevamente.' });
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleEdit = (dish: Dish) => {
    setFormData({
      title: dish.title,
      description: dish.description,
      price: dish.price.toString(),
      image: dish.image,
      category: dish.category,
      available: dish.available
    });
    setEditingId(dish.id);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plato?')) {
      deleteDish(id);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">Gestiona tu restaurante</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                <User className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('dishes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'dishes'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Gestión de Platos</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'account'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Mi Cuenta</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Account Settings Tab */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración de Cuenta</h2>
              
              {accountMessage && (
                <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                  accountMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {accountMessage.type === 'success' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span>{accountMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Nombre de Usuario *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={accountData.username}
                      onChange={handleAccountInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Ingresa tu nombre de usuario"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={accountData.email}
                      onChange={handleAccountInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Ingresa tu email"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Key className="h-4 w-4 inline mr-1" />
                        Contraseña Actual *
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={accountData.currentPassword}
                        onChange={handleAccountInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                        placeholder="Ingresa tu contraseña actual"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={accountData.newPassword}
                          onChange={handleAccountInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                          placeholder="Nueva contraseña (opcional)"
                          minLength={6}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={accountData.confirmPassword}
                          onChange={handleAccountInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                          placeholder="Confirma la nueva contraseña"
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetAccountForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingAccount}
                    className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    {isUpdatingAccount ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Actualizando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dishes Management Tab */}
        {activeTab === 'dishes' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Platos</h2>
                <p className="text-gray-600">Total de platos: {dishes.length}</p>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Nuevo Plato</span>
              </button>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingId) && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-orange-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {isCreating ? 'Crear Nuevo Plato' : 'Editar Plato'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Ej: Pizza Margherita"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Ej: Pizzas, Hamburguesas, Pastas"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen *</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-colors"
                      placeholder="Describe los ingredientes y características del plato..."
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      Plato disponible para pedidos
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isCreating ? 'Crear Plato' : 'Guardar Cambios'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Dishes List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plato
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dishes.map(dish => (
                      <tr key={dish.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={dish.image} 
                              alt={dish.title}
                              className="h-16 w-16 object-cover rounded-lg mr-4 shadow-sm"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{dish.title}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{dish.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-medium">
                            {dish.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ${dish.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                            dish.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {dish.available ? 'Disponible' : 'No disponible'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(dish)}
                              className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                              title="Editar plato"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(dish.id)}
                              className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                              title="Eliminar plato"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {dishes.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay platos registrados</h3>
                  <p className="text-gray-500 mb-6">Comienza agregando tu primer plato al menú</p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Agregar Primer Plato
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;