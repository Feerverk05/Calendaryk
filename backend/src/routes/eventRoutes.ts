import { Router } from 'express';
import * as eventController from '../controllers/eventController';
import { authenticate } from '../middlewares/auth';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  authenticate(req as any, res, next);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  eventController.createEvent(req as any, res)
    .catch(next);
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  eventController.getEvents(req as any, res)
    .catch(next);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  eventController.getEvent(req as any, res)
    .catch(next);
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  eventController.updateEvent(req as any, res)
    .catch(next);
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  eventController.deleteEvent(req as any, res)
    .catch(next);
});

export default router;