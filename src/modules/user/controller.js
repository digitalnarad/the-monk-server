import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  response200,
  response201,
  response400,
  response401,
  response404,
  response409,
} from "../../utils/ApiResponse.js";
import {
  modelName,
  msg,
  hashPassword,
  comparePassword,
  signToken,
  mapUserDBToApi,
} from "../../utils/helper.js";
import { findOne, createOne } from "../../config/db.service.js";
import e from "express";
import { env } from "../../config/env.js";

// POST /api/v1/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { fName, lName, email, password } = req.body || {};
  if (!fName || !lName || !email || !password) {
    return response400(res, "fName, lName, email, password are required");
  }

  const exists = await findOne(modelName.USER, { email }, { _id: 1 });
  if (exists) return response409(res, msg.emailIsExists);

  req.body.password = await hashPassword(password);
  req.body.role = "user";
  req.body.isActive = true;
  req.body.isDeleted = false;

  const created = await createOne(modelName.USER, req.body);
  const user = mapUserDBToApi(created);

  const token = signToken({ id: user.id, role: user.role });

  return response201(res, "Account created", { user, token });
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return response400(res, "email and password are required");
  }

  // Need password for compare; ask full doc (options lean:false)
  const found = await findOne(
    modelName.USER,
    { email, isDeleted: false },
    {},
    { lean: false }
  );
  if (!found) return response401(res, msg.invalidCredentials);

  if (found.isActive === false) {
    return response401(res, msg.accountInActivated);
  }

  const ok = await comparePassword(password, found.password);
  if (!ok) return response401(res, msg.invalidCredentials);

  const user = mapUserDBToApi(found);
  const token = signToken({ id: user.id, role: user.role });
  return response200(res, msg.loginSuccess, { user, token });
});

// GET /api/v1/auth/me
export const me = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  if (!id) return response401(res, "Unauthorized Request");

  const user = await findOne(
    modelName.USER,
    { _id: id, isDeleted: false },
    { fName: 1, lName: 1, email: 1, role: 1, isActive: 1, createdAt: 1 }
  );
  if (!user) return response404(res, "User not found");

  return response200(res, msg.fetchSuccessfully, {
    user: mapUserDBToApi(user),
  });
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return response400(res, "email and password are required");
  }

  const admin = {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  };
  // Need password for compare; ask full doc (options lean:false)
  const found = await findOne(
    modelName.USER,
    { email, isDeleted: false },
    {},
    { lean: false }
  );
  if (!found) return response401(res, msg.invalidCredentials);

  if (found.isActive === false) {
    return response401(res, msg.accountInActivated);
  }

  const ok = await comparePassword(password, found.password);
  if (!ok) return response401(res, msg.invalidCredentials);

  const user = mapUserDBToApi(found);
  const token = signToken({ id: user.id, role: user.role });
  return response200(res, msg.loginSuccess, { user, token });
});
