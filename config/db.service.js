import mongoose from "mongoose";

// Resolve model by name
function modelOf(name) {
  if (!name || typeof name !== "string") {
    throw new Error("Model name must be a non-empty string");
  }
  return mongoose.model(name);
}

// find one
export const findOne = async (
  model,
  where,
  projection = {},
  options = { lean: true }
) => {
  return await modelOf(model).findOne(where, projection, options);
};

// find one with populate
export const findOnePopulate = async (
  model,
  where,
  projection = {},
  options = { lean: true },
  populate = null
) => {
  try {
    let query = modelOf(model).findOne(where, projection, options);
    if (populate) query = query.populate(populate);
    return await query.exec();
  } catch (error) {
    throw new Error(`Error in findOnePopulate: ${error.message}`);
  }
};

// create one
export const createOne = async (model, payload) => {
  return await modelOf(model).create(payload);
};

// create many (use insertMany)
export const createMany = async (
  model,
  payload,
  options = { ordered: true }
) => {
  return await modelOf(model).insertMany(payload, options);
};

// find all (with optional populate in options.populate)
export const findAll = async (
  model,
  criteria,
  projection = {},
  options = { lean: true, populate: "" }
) => {
  const opts = { ...options, lean: true };
  let query = modelOf(model).find(criteria, projection, opts);
  if (options.populate) query = query.populate(options.populate);
  return await query.exec();
};

// update one (return updated doc by default; lean:true,new:true)
export const updateOne = async (model, criteria, dataToSet, options = {}) => {
  const opts = { new: true, lean: true, ...options };
  return await modelOf(model).findOneAndUpdate(criteria, dataToSet, opts);
};

// update many
export const updateMany = async (
  model,
  criteria,
  dataToSet,
  options = { new: false }
) => {
  return await modelOf(model).updateMany(criteria, dataToSet, options);
};

// aggregate data
export const aggregation = async (model, data) => {
  return await modelOf(model).aggregate(data);
};

// populate list query
export const populateQuery = async (
  modelName,
  criteria,
  projection = {},
  options = { lean: true },
  populate = [],
  limit,
  skip,
  sort
) => {
  const opts = { ...options, lean: true };
  let query = modelOf(modelName).find(criteria, projection, opts);
  if (typeof skip === "number") query = query.skip(skip);
  if (typeof limit === "number") query = query.limit(limit);
  if (populate && populate.length) query = query.populate(populate);
  if (sort) query = query.sort(sort);
  return await query.exec();
};

// paginate
export const findPaginateQuery = async (
  modelName,
  criteria,
  sort,
  limit,
  skip
) => {
  return await modelOf(modelName)
    .find(criteria, {}, { lean: true })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// count documents
export const countDocument = async (modelName, criteria) => {
  return await modelOf(modelName).countDocuments(criteria);
};

// delete one
export const deleteDocument = async (model, criteria) => {
  return await modelOf(model).findOneAndDelete(criteria);
};

// delete many
export const deleteManyDocument = async (model, criteria) => {
  return await modelOf(model).deleteMany(criteria);
};

export default {
  findOne,
  findOnePopulate,
  createOne,
  createMany,
  findAll,
  updateOne,
  updateMany,
  aggregation,
  populate: populateQuery,
  countDocument,
  deleteDocument,
  deleteManyDocument,
  findPaginateQuery,
};
