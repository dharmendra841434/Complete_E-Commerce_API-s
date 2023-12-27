export function validateField(value, fieldName) {
  if (value === undefined || value.trim() === "") {
    return {
      statusCode: 400,
      status: false,
      message: `${fieldName} field is required`,
    };
  }
  return null;
}
