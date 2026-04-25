// routes/area.routes.ts
import { Router } from "express";
import { AreaController } from "./area.controller.js";
import { verifyToken ,adminOnly} from "../../common/middleware/auth.middleware.js";
import { upload } from "../../common/middleware/multer.middleware.js";

const router = Router();
const areaController = new AreaController();

// Area routes
router.post("/create",verifyToken,adminOnly,upload.single('image'), areaController.createArea);
router.get("/get-all", areaController.getAllAreas);
router.get("/statistics",verifyToken,adminOnly, areaController.getAreaStatistics);
router.get("/:slug", areaController.getAreaBySlug);
router.get("/check-slug",verifyToken, areaController.checkSlugUniqueness);
router.get("/:id",verifyToken, areaController.getAreaById);
router.put("/:id",verifyToken,adminOnly,upload.single('image'), areaController.updateArea);
router.delete("/:id",verifyToken,adminOnly, areaController.deleteArea);
router.get("/search/name",verifyToken,areaController.searchAreaByName);

export default router;