// routes/lead.routes.ts
import { Router } from "express";
import { LeadController } from "./lead.controller.js";
import { verifyToken,adminOnly } from "../../common/middleware/auth.middleware.js";

const router = Router();
const leadController = new LeadController();

// Lead routes
router.post("/create", verifyToken,adminOnly, leadController.createLead);
router.get("/get-all", verifyToken, leadController.getAllLeads);
router.get("/statistics", verifyToken, leadController.getLeadStatistics);
router.get("/:id", verifyToken, leadController.getLeadById);
router.put("/:id", verifyToken,adminOnly, leadController.updateLead);
router.delete("/:id", verifyToken,adminOnly, leadController.deleteLead);
router.get("/search/name", verifyToken, leadController.searchLead);
export default router;