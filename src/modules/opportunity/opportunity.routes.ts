import { Router } from "express";
import { PropertyController } from "./opportunity.controller.js";
import { validateProperty } from "./opportunity.validation.js";
import { upload } from "../../common/middleware/multer.middleware.js";

const router = Router();
const propertyController = new PropertyController();

// Public routes
router.get("/", propertyController.getProperties.bind(propertyController));
router.get("/:id", propertyController.getPropertyById.bind(propertyController));
router.get("/slug/:slug", propertyController.getPropertyBySlug.bind(propertyController));

// Protected routes (add authentication middleware as needed)
router.post(
  "/",
  upload.array("images", 10), // Max 10 images
  validateProperty,
  propertyController.createProperty.bind(propertyController)
);

router.put(
  "/:id",
  upload.array("images", 10),
  propertyController.updateProperty.bind(propertyController)
);

router.delete("/:id", propertyController.deleteProperty.bind(propertyController));

router.patch(
  "/:id/images",
  propertyController.removeImages.bind(propertyController)
);

export default router;