// routes/opportunity.routes.ts
import { Router } from "express";
import { OpportunityController } from "./opportunity.controller.js";
import { verifyToken ,ManagerAndadmin} from "../../common/middleware/auth.middleware.js";
import { upload } from "../../common/middleware/multer.middleware.js";

const router = Router();
const opportunityController = new OpportunityController();

// Opportunity routes
router.post("/create",verifyToken,ManagerAndadmin,upload.array('images',5), opportunityController.createOpportunity);
router.get("/get-all",verifyToken, opportunityController.getAllOpportunities);
router.get("/statistics",verifyToken,ManagerAndadmin, opportunityController.getOpportunityStatistics);
router.get("/status/:status",verifyToken, opportunityController.getOpportunitiesByStatus);
router.get("/:slug", opportunityController.getOpportunityBySlug);
router.get("/:id",verifyToken, opportunityController.getOpportunityById);
router.put("/:id",verifyToken,ManagerAndadmin,upload.array('images',5), opportunityController.updateOpportunity);
router.delete("/:id",verifyToken,ManagerAndadmin, opportunityController.deleteOpportunity);
router.post("/bulk-delete",verifyToken,ManagerAndadmin, opportunityController.bulkDeleteOpportunities);
router.get("/search/title",verifyToken, opportunityController.searchOpportunity);



export default router;