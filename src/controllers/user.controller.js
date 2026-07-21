import asyncHandler from "../utils/asyncHandler.js"


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // upload them to cloudinary , avatar
    // create user objet - create emtry in db
    // remove password and refresh token field from response
    // check for user creation
    // return responce

    
    res.status(200).json({
        message: "ok"
    })
})

export default registerUser