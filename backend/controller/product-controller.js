import Product from "../models/product.model.js";

// @ desc Create a Product
// @ route POST /api/v1/products
// @ private

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, quantity } = req.body;

    if (!name || !price || !description || !quantity || !req.file) {
      const missingProducts = [];
      if (!name) missingProducts.push("name");
      if (!price) missingProducts.push("price");
      if (!description) missingProducts.push("description");
      if (!quantity) missingProducts.push("quantity");
      if (!req.file) missingProducts.push("image");

      const error = new Error(
        `Please include ${missingProducts.join(" and ")}.`
      );
      error.status = 400;
      return next(error);
    }
    const productData = {
      name,
      price,
      description,
      quantity,
      productImage: `/public/data/uploads/${req.file.filename}`,
      userId: req.userId,
    };

    const product = await Product.create(productData);
    res.status(201).json({
      message: `Product Created Sucessfully  `,
      product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// @ desc Get All the Products
// @ route GET /api/v1/products
// @ private

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.userId });
    res.status(200).json({
      message: `Product Fetched Sucessfully  `,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ desc Get One Product
// @ route GET /api/v1/products/:id
// @ private

export const getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error(`Product with the id ${id} was not found `);
      error.status = 404;
      return next(error);
    }
    res.status(200).json({
      message: `Product with id ${id} Fetched Sucessfully  `,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ desc Update a Product
// @ route PUT /api/v1/products/:id
// @ private

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      const error = new Error(` Product with the id ${id} was not found `);
      error.status = 404;
      return next(error);
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json({
      message: `Product Updated Sucessfully  `,
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ desc Delete a Product
// @ route DELETE /api/v1/products/:id
// @ private

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      const error = new Error(`Product with the id ${id} was not found `);
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
