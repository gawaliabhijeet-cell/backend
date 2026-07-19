
// 2nd method
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch((err) => next(err))
    }
}



export {asyncHandler}


// wrapper function 1st method
// const asyncHandler = (fn) => async(req, res, next) => {
//     try{
//         await fn(req,res,next)
//     }catch(error) {
//         res.state(error,code || 500).json({
//             success: false,
//             message: err.message
//         })       
//     }
// }