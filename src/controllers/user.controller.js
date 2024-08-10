import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { APiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req,res)=>{
    // get user details from from front end
    // Validation - Not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudnary
    // create user object - create entry in DB
    // remove password and refresh token fielc from response
    // check for user creation
    // return response 

    const {fullName,email, username, password} = req.body
    console.log("email", email);

    // if (fullName=="") {
    //     throw new ApiError(400, "Full name is required")
    // }

    if ([fullName, email, username,password].some((field)=>field ?.trim()==='')) {
        throw new ApiError(400, "All field are compulsory and required")
    }

    const existedUser = User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with username or email already exists")
    }

    const avatarLoacalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    
    if (!avatarLoacalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLoacalPath)

    const converImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:converImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new APiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser}