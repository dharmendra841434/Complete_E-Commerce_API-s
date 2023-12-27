import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
} from "../controller/product.controller.js";

const product_router = Router();

product_router.route("/create").post(
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]),
  createProduct
);
product_router.route("/update/:id").put(updateProduct);
product_router.route("/delete/:id").delete(deleteProduct);
product_router.route("/products-list").get(getAllProduct);
product_router.route("/single-product/:id").get(getSingleProduct);
export default product_router;
