import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Пошта обов\'язкова';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Невірний формат пошти';
    }
    
    if (!password) {
      newErrors.password = 'Пароль обов\'язковий';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login({ email, password });
      navigate('/');
    } catch (error: any) {
      setErrors({
        general: 
          error?.response?.data?.message || 
          'Помилка входу. Перевірте ваші дані та спробуйте знову.'
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-6">
        Вхід
      </h2>
      
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Електронна пошта"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        
        <Input
          id="password"
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
        
        <Button 
          type="submit" 
          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Увійти
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Ще не маєте акаунту?{' '}
          <a href="/register" className="text-blue-600 hover:underline transition-all duration-200">
            Зареєструватися
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
