import Category from './model.js';

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById({ _id: req.params.id });
        if (!category || category.isDeleted) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a category
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id },       // Filter
            req.body,                     // Update
            { new: true, runValidators: true } // Options
        );

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Soft delete a category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate({ _id: req.params.id });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};