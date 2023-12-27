import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const admin = await Admin.findById(userId);

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { username, fullName, password } = req.body;

  console.log(req.body);

  if (fullName.trim() === "") {
    throw new ApiError(400, "fullName is required");
  }

  const admin = await Admin.findOne({ username: username });

  if (admin) {
    throw new ApiError(409, "Username already exist");
  }

  const createdAdmin = await Admin.create({
    username,
    fullName,
    password,
  });

  const created = await Admin.findById(createdAdmin._id).select("-password ");

  if (!created) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, created, "Admin created Successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { username, password } = req.body;

  // console.log(req.body);

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const admin = await Admin.findOne({ username: username });

  if (!admin) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    admin._id
  );

  // console.log(accessToken, "sdjlks");

  const loggedInAdmin = await Admin.findById(admin._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          data: loggedInAdmin,
          accessToken,
          refreshToken,
        },
        "Admin logged In Successfully"
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  //   await Admin.findByIdAndUpdate(
  //     req.admin._id,
  //     {
  //       $set: {
  //         refreshToken: undefined,
  //       },
  //     },
  //     {
  //       new: true,
  //     }
  //   );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerAdmin, loginAdmin, logoutAdmin };
