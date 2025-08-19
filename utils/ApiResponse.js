import HttpStatus from "./helper.js";

function json(res, status, message, response = null, extra = {}) {
  return res.status(status).json({ status, message, response, ...extra });
}

export const response200 = (
  res,
  message = "Fetch successful",
  response = null,
  extra
) => json(res, HttpStatus.OK, message, response, extra);

export const response201 = (
  res,
  message = "Created successfully",
  response = null,
  extra
) => json(res, HttpStatus.CREATED, message, response, extra);

export const response400 = (res, message = "Bad Request", extra) =>
  json(res, HttpStatus.BAD_REQUEST, message, null, extra);

export const response401 = (res, message = "Unauthorized Request", extra) =>
  json(res, HttpStatus.UNAUTHORIZED, message, null, extra);

export const response404 = (res, message = "Not Found", extra) =>
  json(res, HttpStatus.NOT_FOUND, message, null, extra);

export const response409 = (res, message = "Conflict", extra) =>
  json(res, HttpStatus.CONFLICT, message, null, extra);

export const response500 = (res, message = "Internal Server Error", extra) =>
  json(res, HttpStatus.ERROR, message, null, extra);
