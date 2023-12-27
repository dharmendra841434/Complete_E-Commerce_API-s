export function ErrorHandler(error, message, res) {
  if (error.name === "CastError" && error.kind === "ObjectId") {
    // Handle the "Cast to ObjectId failed" error here
    //console.log(error);
    return res.status(500).send({
      success: false,
      statusCode: 404,
      message: message,
    });
    // console.error("Invalid ObjectId format");
  } else {
    return res.status(err.status || 500).json({
      success: false,
      response: err.message || "Internal Server Error",
    });
  }
}
