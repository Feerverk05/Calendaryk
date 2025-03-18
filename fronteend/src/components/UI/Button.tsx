import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false,
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300',
  };
  
  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

export default Button;