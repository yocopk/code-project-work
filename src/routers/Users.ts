import { Router } from "express";
import { ControllerUsers } from "../controllers/Users";

const user = new ControllerUsers();
const router = Router();

router.post("/register", user.register);
router.post("/register/admin", user.registerAdmin);
router.post("/login", user.login);
router.get("/logout", user.logout);

export default router;
