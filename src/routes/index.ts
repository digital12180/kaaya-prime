import authRoutes from "../modules/auth/auth.routes.js";
import leadRoutes from "../modules/lead/lead.routes.js";
import opportunityRoutes from "../modules/opportunity/opportunity.routes.js";
import areaRoutes from "../modules/area/area.routes.js";
import blogRoutes from "../modules/blog/blog.routes.js";
import reportRoutes from "../modules/report/report.routes.js"
import { Router } from "express";
import landingPageRoutes from "../modules/landingPage/landingPage.routes.js"
import userRoutes from "../modules/user/user.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.route.js";
import insightRoutes from "../modules/dashboard/Insight.route.js";
import rentalyieldRoutes from "../modules/dashboard/rental-yield.route.js";
import developerRoutes from "../modules/dashboard/developer.route.js";
import stageRoutes from "../modules/dashboard/stage.route.js";
const router = Router();

router.use('/auth', authRoutes);
router.use('/lead', leadRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/areas', areaRoutes);
router.use('/blogs', blogRoutes);
router.use('/reports', reportRoutes);
router.use('/landing-pages', landingPageRoutes);
router.use('/users', userRoutes);
router.use('/metrics', dashboardRoutes);
router.use('/insights', insightRoutes);
router.use('/rental-yields', rentalyieldRoutes);
router.use('/developer-scores', developerRoutes);
router.use('/stages', stageRoutes);



export default router;
