import { response400 } from "../utils/ApiResponse.js";

export const validator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return response400(res, error.details[0].message);
    }
    next();
  };
};
