// routes/landingPage.routes.ts
import { Router } from "express";
import { LandingPageController } from "./landingPage.controller.js";
import { verifyToken } from "../../common/middleware/auth.middleware.js";
const router = Router();
const landingPageController = new LandingPageController();
// Landing page routes
router.post("/create", verifyToken, landingPageController.createLandingPage);
router.get("/get-all", verifyToken, landingPageController.getAllLandingPages);
router.get("/published", verifyToken, landingPageController.getPublishedLandingPages);
router.get("/statistics", verifyToken, landingPageController.getLandingPageStatistics);
router.get("/search/title", verifyToken, landingPageController.searchLandingPagesByTitle);
router.get("/status/:status", verifyToken, landingPageController.getLandingPagesByStatus);
router.get("/form-type/:formType", verifyToken, landingPageController.getLandingPagesByFormType);
router.get("/check-slug", verifyToken, landingPageController.checkSlugUniqueness);
router.get("/slug/:slug", verifyToken, landingPageController.getLandingPageBySlug);
router.get("/admin/slug/:slug", verifyToken, landingPageController.getLandingPageBySlugAdmin);
router.get("/:id", verifyToken, landingPageController.getLandingPageById);
router.put("/:id", verifyToken, landingPageController.updateLandingPage);
router.patch("/:id/status", verifyToken, landingPageController.updateLandingPageStatus);
router.delete("/:id", verifyToken, landingPageController.deleteLandingPage);
router.post("/bulk-delete", verifyToken, landingPageController.bulkDeleteLandingPages);
export default router;
//# sourceMappingURL=landingPage.routes.js.map