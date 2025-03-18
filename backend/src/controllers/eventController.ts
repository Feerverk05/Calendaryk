import { Response } from 'express';
import { Op } from 'sequelize';
import {Event } from '../models'
import { EventImportance } from '../models/Event';
import { AuthRequest } from '../middlewares/auth';

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate, importance } = req.body;
    const userId = req.user.id;
    
    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      importance: importance || EventImportance.NORMAL,
      userId
    });
    
    return res.status(201).json({
      message: 'Подія успішно створена',
      event
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { importance, keyword } = req.query;
    
    let whereCondition: any = { userId };
    
    if (importance) {
      whereCondition.importance = importance;
    }
    
    if (keyword) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { title: { [Op.iLike]: `%${keyword}%` } },
          { description: { [Op.iLike]: `%${keyword}%` } }
        ]
      };
    }
    
    const events = await Event.findAll({
      where: whereCondition,
      order: [['startDate', 'ASC']]
    });
    
    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const getEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const event = await Event.findOne({
      where: { id, userId }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Подію не знайдено' });
    }
    
    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, importance } = req.body;
    const userId = req.user.id;
    
    const event = await Event.findOne({
      where: { id, userId }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Подію не знайдено' });
    }
    
    await event.update({
      title,
      description,
      startDate,
      endDate,
      importance
    });
    
    return res.status(200).json({
      message: 'Подію успішно оновлено',
      event
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const event = await Event.findOne({
      where: { id, userId }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Подію не знайдено' });
    }
    
    await event.destroy();
    
    return res.status(200).json({
      message: 'Подію успішно видалено'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};