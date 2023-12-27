import { Products } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { product_name, category, price, discount, description } = req.body;

    if (
      [product_name, category, price, discount, description].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
    let productImages = req.files;
    if (
      !(
        productImages?.images &&
        Array.isArray(productImages?.images) &&
        productImages?.images?.length > 0
      )
    ) {
      throw new ApiError(400, "Images are required");
    }

    if (
      !(
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
      )
    ) {
      throw new ApiError(400, "CoverImage is required");
    }

    let coverImageLocalPath = req.files.coverImage[0].path;
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    const filePromises = req?.files?.images?.map(async (file) => {
      const uploadedFile = await uploadOnCloudinary(file.path);
      return uploadedFile?.url;
    });
    const savedFiles = await Promise.all(filePromises);

    console.log(savedFiles, "files");
    console.log(coverImage, "cover");
    const productInstance = new Products({
      product_name: product_name,
      category: category,
      price: Number(price),
      discount: Number(discount),
      description: description,
      images: savedFiles,
      coverImage: coverImage?.url,
    });
    await productInstance.save();
    res
      .status(200)

      .send({ success: true, statusCode: 201, message: "new Product Created" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading files", error: error.message });
  }
});

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const { product_name, category, price, discount, description } = req.body;

    if (product_name !== undefined && product_name.trim() === "") {
      return res.status(400).send({
        statusCode: 400,
        success: false,
        message: "Product name field is required",
      });
    }
    if (category !== undefined && category.trim() === "") {
      return res.status(400).send({
        statusCode: 400,
        success: false,
        message: "Category field is required",
      });
    }
    if (price !== undefined && price === "") {
      return res.status(400).send({
        statusCode: 400,
        success: false,
        message: "Price field is required",
      });
    }
    if (discount !== undefined && discount === "") {
      return res.status(400).send({
        statusCode: 400,
        success: false,
        message: "Discount field is required",
      });
    }
    if (description !== undefined && description.trim() === "") {
      return res.status(400).send({
        statusCode: 400,
        success: false,
        message: " Description field is required",
      });
    }

    const updateData = {
      product_name: product_name,
      category: category,
      price: price, //!== undefined && Number(price),
      discount: discount, //!== undefined && Number(discount),
      description: description,
    };

    const productInstance = await Products.findByIdAndUpdate(id, updateData, {
      new: true, // To return the updated document
      useFindAndModify: false, // Avoid deprecated warning
    });
    if (!productInstance) {
      throw new ApiError(404, "Product Not Found!!!");
    }
    // console.log(t, "producvt");

    res.status(200).send({
      statusCode: 201,
      message: "Product details Updated",
      success: true,
    });
  } catch (error) {
    ErrorHandler(error, "Product Not found!!!", res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Products.findByIdAndDelete(id);

    if (!result) {
      res.status(404).send({
        message: "Not Found!!!",
        statusCode: 404,
        success: false,
      });
    }
    res.status(200).send({
      statusCode: 200,
      success: true,
      message: "Product deleted sucessfully ",
    });
  } catch (err) {
    ErrorHandler(err, "Product Not found!!!", res);
  }
};

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const productList = await Products.find();
    res.status(200).send({
      success: true,
      data: productList,
      statusCode: 200,
    });
  } catch (error) {
    ErrorHandler(error, "There is No Any Products", res);
  }
});

const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const singleProduct = await Products.findById(id);

    res.status(200).send({
      success: true,
      data: singleProduct,
      statusCode: 200,
    });
  } catch (error) {
    ErrorHandler(error, "There is No Any Products", res);
  }
});

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
};
