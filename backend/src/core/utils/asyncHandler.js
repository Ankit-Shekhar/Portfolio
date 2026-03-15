// asyncHandler is a higher order function, ie. it takes a function as an argument and returns a new function
//try catch method
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (err) {
//     console.error(err);
//     res.status(err.code || 500).json({
//        success: false,
//        message: err.message || 'An error occurred'
//     });
//   }
// }

// export default asyncHandler;


//Promise method
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
    .catch((err) => next(err));
  }
}
export { asyncHandler }

// // why are we using asyncHandler: answer from chatGPT:
// Got it — I’ll explain what asyncHandler does, why it’s useful.

// What it is: A small wrapper that catches errors from your async route/controller functions and passes them to Express’s error handler.
// Why you need it: Without it, every async controller needs its own try/catch. With it, you write clean async code and let one central error middleware handle failures.
// How it works: It calls your handler and, if the returned Promise rejects or throws, it does next(err) so Express can respond properly instead of hanging.