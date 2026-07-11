import { Router } from "express";
import { CareerController } from "./career.controller.js";
import { upload } from "../../common/middleware/multer.middleware.js";

const router = Router();
const careerController = new CareerController();

// CRUD Routes
router.post(
    "/",
    upload.single("cv"),
    careerController.createCareer
);

router.get(
    "/",
    careerController.getCareers
);

router.get(
    "/:id",
    careerController.getCareerById
);

router.put(
    "/:id",
    upload.single("cv"),
    careerController.updateCareer
);

router.delete(
    "/:id",
    careerController.deleteCareer
);

export default router;