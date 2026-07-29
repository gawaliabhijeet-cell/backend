import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // user bar bar login na kearn padhe
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
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
  console.log("Body:", req.body);
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
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

const loginUser = asyncHandler(async (req, res ) => {

  // req body => data
  // username or email
  // find the user
  // password check
  // access and referesh token
  // send cookie

  const {email, username, password } = req.body

  if(!username && !email) {
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

     const { accessToken, refreshToken } = 
     await generateAccessAndRefreshTokens(user._id);

   const loggedInUser = await User.findById(user._id).
   select("-password -refreshToken")

   // cokies
   const options = {
      httpOnly : true,
      secure: true
   }

   return res.status(200).cookie("accessToken", accessToken, options)
   .cookie("refreshToken" , refreshToken ,options)
   .json(
    new ApiResponse(
      200, {
        user: loggedInUser, accessToken, refreshToken
      },
      "User logged in successfully"
    )
   )
})

const logoutUser = asyncHandler(async (req, res) => {
    await  User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            refreshToken: undefined
          }
        },

        {
          new: true
        }

      )

      const options = {
      httpOnly : true,
      secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options )
   .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try{
    const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  )

 const user = await User.findById(decodedToken?._id)
 if (!user) {
  throw new ApiError(401, "Invalid refresh token")
 }

 if (incomingRefreshToken !== user?.refreshToken) {
  throw new ApiError(401, "Refresh token is expired or used")
  
 }

  const options = {
    httpOnly: true,
    secure: true
  }

  const {accessToken , newrefreshToken } = await generateAccessAndRefreshTokens(user._id)

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200,
      {accessToken , newrefreshToken: newrefreshToken},
      "Access token refreshed"
    )
  )

  }catch(error){
    throw new ApiError(401, error?.message || "invalid refresh token")
  }
}) 

const changeCurrentPassword = asyncHandler(async (req, res) => {
  
  const {oldPassword, newPassword} = req.body

  const user = await User.findById(req.user?._id)
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect){
    throw new ApiError(400 ,"invalid old password")
   }

   user.password = newPassword
   await user.save({validateBeforeSave : false})

   return res
   .status(200)
   .json(new ApiResponse(200 , {}, "password is correct"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
  const {fullName, email} = req.body

  if(!fullName || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email
      }
    },
    {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "account updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req,res) =>{
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")

  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar: avatar.url
      }
    },
    {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200, user, "Avatar updated successfully")
  )
})

const updateUserCoverImage = asyncHandler(async(req,res) =>{
  const CoverLocalPath = req.file?.path

  if (!CoverLocalPath) {
    throw new ApiError(400, "CoverImage file is missing")
  }

  const coverImage = await uploadOnCloudinary(CoverLocalPath)

  if (coverImage.url) {
        throw new ApiError(400, "Error while uploading on coverImage")

  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage: coverImage.url
      }
    },
    {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200, user, "Cover image updated successfully")
  )
})

export  {registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage
};
