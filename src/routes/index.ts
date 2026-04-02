import authRoutes from "../modules/auth/auth.routes.js";
import leadRoutes from "../modules/lead/lead.routes.js";
import opportunityRoutes from "../modules/opportunity/opportunity.routes.js"
import { Router } from "express";

const router = Router();

router.use('/auth', authRoutes);
router.use('/lead', leadRoutes);
router.use('/opportunities', opportunityRoutes);


export default router;
