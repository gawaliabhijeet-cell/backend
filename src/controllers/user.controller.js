import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // upload them to cloudinary , avatar
    // create user objet - create emtry in db
    // remove password and refresh token field from response
    // check for user creation
    // return responce


   const {username, email, fullName, password} = req.body
   console.log("email" , email);

    if(
        [fullName, email, username,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

   const existedUser =  User.findOne({
        $or: [{ username }, { email }]
    })
   
    if(existedUser){
        throw new ApiError(409, "User with email or username already exit")
    }

    const avatarLocalPath = req.files?.avater[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

   const avatar =  await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar){
            throw new ApiError(400, "Avatar file is required")

   }

   User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()   
   })
})  

export default registerUser