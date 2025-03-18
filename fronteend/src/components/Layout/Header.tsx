import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';

const Header: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            Каледарик
          </Link>
          
          {isAuthenticated && (
            <nav className="ml-8">
              <ul className="flex space-x-6">
                <li className="transition-all duration-300 ease-in-out transform hover:scale-105">
                  <Link to="/" className="text-gray-700 hover:text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-blue-100">
                    Календар
                  </Link>
                </li>
                <li className="transition-all duration-300 ease-in-out transform hover:scale-105">
                  <Link to="/events" className="text-gray-700 hover:text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-blue-100">
                    Список подій
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
        
        <div>
          {isAuthenticated && currentUser ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={handleLogout} 
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-700 hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Вийти
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login">
                <Button className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-700 hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg">
                  Увійти
                </Button>
              </Link>
              <Link to="/register">
                <Button className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg">
                  Зареєструватися
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;