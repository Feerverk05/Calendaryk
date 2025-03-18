import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import jwtConfig from '../config/jwt';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Необхідна авторизація' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as any;
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'Користувача не знайдено' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Недійсний токен' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};