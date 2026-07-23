import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponce.js";
import { upload } from "../middlewares/multer.js";

const generateAccessAndRefershTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refrechToken = user.generateRefreshToken();

  // user bar bar login na kearn padhe
  user.refrechToken = refrechToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refrechToken };
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // upload them to cloudinary , avatar
  // create user objet - create emtry in db
  // remove password and refresh token field from response
  // check for user creation
  // return responce

  const { username, email, fullName, password } = req.body;


  //   console.log("email", email);
  // console.log("Body:", req.body);
  //  console.log("Files:", req.files);


  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exit");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // error for avator
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // User is conect the mongodb
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // create for  User error conect or not
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register sucessesfully"));
});

const loginUser = asyncHandler(async (req, res ) => {
  // req body => data
  // username or email
  // find the user
  // password check
  // access and referesh token
  // send cookie

  const {email, ucookiesername, password } = req.body

  if(!username || !email) {
    throw new ApiError(400 , "username or emaail is required")

  }

    const user = await User.findOne({
      $or : [{username} , {email}]
    })

    if(!user) {
      throw new ApiError(404, "User does not exit")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
   }

   const {accessToken , refrechToken } = await 
   generateAccessAndRefershTokens(user._id)

   const loggedInUser = await User.findById(user._id).
   select("-password -refreshToken")

   // cokies
   const options = {
      httpOnly : true,
      secure: true
   }

   return res.status(200).cookie("accessToken", accessToken, options)
   .cookie("refreshToken" , refrechToken ,options)
   .json(
    new ApiResponse(
      200, {
        user: loggedInUser, accessToken, refrechToken
      },
      "User logged in successfully"
    )
   )
})

const logoutUser = asyncHandler(async (req, res) => {

})

 
export  {registerUser,
  loginUser,
  logoutUser
};
