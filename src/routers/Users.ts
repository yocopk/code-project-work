import { Router } from "express";
import { ControllerUsers } from "../controllers/Users";

const user = new ControllerUsers();
const userRoutes = Router();

userRoutes.post("auth/register", user.register);
userRoutes.post("auth/register/admin", user.registerAdmin);
userRoutes.post("auth/login", user.login);
userRoutes.get("auth/logout", user.logout);

export default userRoutes;
