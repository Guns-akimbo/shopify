import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
} from "../controller/product-controller.js";
import multer from "multer";
import validateToken from "../middleware/validate-token.js";
const upload = multer({ dest: "./public/data/uploads/" });

const router = express();

router.use(validateToken);
// create a product
router.post("/", upload.single("productImage"), createProduct);

// get all product
router.get("/", getAllProduct);

// get single product
router.get("/:id", getSingleProduct);

// update a product
router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
