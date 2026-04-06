// routes/setting.routes.ts
import { Router } from "express";
import { SettingController } from "./settings.controller.js";
import { verifyToken, adminOnly } from "../../common/middleware/auth.middleware.js";

const router = Router();
const settingController = new SettingController();

// Setting routes
router.post("/settings", verifyToken, adminOnly, settingController.createSetting);
router.post("/settings/bulk", verifyToken, settingController.bulkUpsertSettings);
router.get("/settings", verifyToken, adminOnly, settingController.getAllSettings);
router.get("/settings/all", verifyToken, adminOnly, settingController.getAllSettingsAsObject);
router.get("/settings/statistics", verifyToken, settingController.getSettingStatistics);
router.get("/settings/predefined", verifyToken, adminOnly, settingController.getPredefinedSettings);
router.post("/settings/initialize", verifyToken, adminOnly, settingController.initializeDefaultSettings);
router.get("/settings/key/:key/exists", verifyToken, adminOnly, settingController.checkSettingExists);
router.get("/settings/:id", verifyToken, adminOnly, settingController.getSettingById);
router.put("/settings/key/:key", verifyToken, adminOnly, settingController.updateSettingByKey);
router.put("/settings/:id", verifyToken, adminOnly, settingController.updateSettingById);
router.delete("/settings/key/:key", verifyToken, adminOnly, settingController.deleteSettingByKey);
router.delete("/settings/:id", verifyToken, adminOnly, settingController.deleteSettingById);
router.post("/settings/bulk-delete", verifyToken, adminOnly, settingController.bulkDeleteSettings);

export default router;