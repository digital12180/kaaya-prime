// routes/opportunity.routes.ts
import { Router } from "express";
import { OpportunityController } from "./opportunity.controller.js";
import { verifyToken } from "../../common/middleware/auth.middleware.js";

const router = Router();
const opportunityController = new OpportunityController();

// Opportunity routes
router.post("/create",verifyToken, opportunityController.createOpportunity);
router.get("/get-all",verifyToken, opportunityController.getAllOpportunities);
router.get("/statistics",verifyToken, opportunityController.getOpportunityStatistics);
router.get("/status/:status",verifyToken, opportunityController.getOpportunitiesByStatus);
router.get("/:id",verifyToken, opportunityController.getOpportunityById);
router.put("/:id",verifyToken, opportunityController.updateOpportunity);
router.delete("/:id",verifyToken, opportunityController.deleteOpportunity);
router.post("/bulk-delete",verifyToken, opportunityController.bulkDeleteOpportunities);
router.get("/search/title",verifyToken, opportunityController.searchOpportunity);



export default router;