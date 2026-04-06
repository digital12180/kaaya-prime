// routes/area.routes.ts
import { Router } from "express";
import { AreaController } from "./area.controller.js";
import { verifyToken } from "../../common/middleware/auth.middleware.js";
const router = Router();
const areaController = new AreaController();
// Area routes
router.post("/create", verifyToken, areaController.createArea);
router.get("/get-all", verifyToken, areaController.getAllAreas);
router.get("/statistics", verifyToken, areaController.getAreaStatistics);
router.get("/slug/:slug", verifyToken, areaController.getAreaBySlug);
router.get("/check-slug", verifyToken, areaController.checkSlugUniqueness);
router.get("/:id", verifyToken, areaController.getAreaById);
router.put("/:id", verifyToken, areaController.updateArea);
router.delete("/:id", verifyToken, areaController.deleteArea);
router.post("/bulk-delete", verifyToken, areaController.bulkDeleteAreas);
router.get("/search/name", verifyToken, areaController.searchAreaByName);
export default router;
//# sourceMappingURL=area.routes.js.map