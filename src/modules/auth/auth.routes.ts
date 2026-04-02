import { Router } from "express";
import { AdminController } from "./auth.controller.js";
import { verifyToken } from "../../common/middleware/auth.middleware.js";

const router = Router();
const controller = new AdminController();

router.post(
    "/register",
    controller.register
);

router.post(
    "/login",
    controller.login
);

router.post(
    "/logout",
    verifyToken,
    controller.logout
);
router.get(
    "/profile",
    verifyToken,
    controller.getProfile
);
router.put(
    "/update-profile",
    verifyToken,
    controller.updateProfile
);

router.route('/forgot-password').post(controller.forgotPassword);
router.route('/reset-password').post(controller.resetPassword);

export default router;