import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controller/admin.controller.js";

const admin_Router = Router();

admin_Router.route("/create-admin").post(registerAdmin);
admin_Router.route("/login").post(loginAdmin);
admin_Router.route("/logout").post(logoutAdmin);

export default admin_Router;
