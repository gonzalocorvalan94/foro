import { getAllCategories } from '../models/categoryModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllCategoriesController = catchAsync(async (req, res, next) => {
  const categories = await getAllCategories();
  res.status(200).json({
    status: 'success',
    data: { categories },
  });
});