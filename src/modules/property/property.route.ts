import { Router } from 'express';
import { PropertyController } from './property.controller.js';
import { upload } from '../../common/middleware/multer.middleware.js';

const router = Router();
const propertyController = new PropertyController();

// Middleware to handle file uploads
const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'floorPlan', maxCount: 1 },
  { name: 'videoTour', maxCount: 1 },
]);

// Routes
router.post(
  '/',
  uploadFields,
  propertyController.create.bind(propertyController)
);

router.get(
  '/',
  propertyController.getAll.bind(propertyController)
);

router.get(
  '/:id',
  propertyController.getById.bind(propertyController)
);

router.put(
  '/:id',
  uploadFields,
  propertyController.update.bind(propertyController)
);

router.delete(
  '/:id',
  propertyController.delete.bind(propertyController)
);

export default router;