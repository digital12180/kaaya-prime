// routes/lead.routes.ts
import { Router } from "express";
import { LeadController } from "./lead.controller.js";
import { verifyToken, adminOnly } from "../../common/middleware/auth.middleware.js";

const router = Router();
const leadController = new LeadController();

// Lead routes
router.post("/create", verifyToken, leadController.createLead);
router.get("/get-all", verifyToken, leadController.getAllLeads); //BY ADMIN AND MANAGER
router.get("/statistics", verifyToken, leadController.getLeadStatistics);
router.get("/:id", verifyToken, leadController.getLeadById);
router.put("/:id", verifyToken, leadController.updateLead);
router.delete("/:id", verifyToken, leadController.deleteLead);
router.get("/search/name", verifyToken, leadController.searchLead);
export default router;