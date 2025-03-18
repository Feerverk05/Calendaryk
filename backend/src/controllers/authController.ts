import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import jwtConfig from '../config/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Отримуємо всі необхідні поля з тіла запиту
    const { email, password, firstName, lastName } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Користувач з такою поштою вже існує' });
      return;
    }
    
    const user = await User.create({
      email,
      password,
      firstName,  // Тепер ці змінні отримані з req.body
      lastName
    });
    
    const token = jwt.sign({ id: user.id }, jwtConfig.secret as string, {
      expiresIn: '1d' 
    });
    
    res.status(201).json({
      message: 'Користувач успішно зареєстрований',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'Користувача з такою поштою не знайдено' });
      return;
    }
    
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Невірний пароль' });
      return;
    }
    
    const token = jwt.sign({ id: user.id }, jwtConfig.secret as string, {
      expiresIn: '1d'
    });
    
    res.status(200).json({
      message: 'Успішний вхід',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,  // Додаємо ім'я
        lastName: user.lastName     // Додаємо прізвище
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};