import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    general?: string;
  }>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      firstName?: string;
      lastName?: string;
    } = {};
    
    if (!formData.email) {
      newErrors.email = 'Пошта обов\'язкова';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Невірний формат пошти';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обов\'язковий';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль має бути не менше 6 символів';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Паролі не співпадають';
    }
    
    if (!formData.firstName) {
      newErrors.firstName = 'Ім\'я обов\'язкове';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Прізвище обов\'язкове';
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
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (error: any) {
      setErrors({
        general: 
          error?.response?.data?.message || 
          'Помилка реєстрації. Спробуйте ще раз.'
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-6">Зареєструватися</h2>
      
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName"
            label="Ім'я"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          
          <Input
            id="lastName"
            name="lastName"
            label="Прізвище"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>
        
        <Input
          id="email"
          name="email"
          label="Електронна пошта"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <Input
          id="password"
          name="password"
          label="Пароль"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Підтвердіть пароль"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
        
        <Button 
          type="submit" 
          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Зареєструватися
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Вже маєте акаунт?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Увійти
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;