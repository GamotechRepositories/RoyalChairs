import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all active categories with product counts & subcategories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });

    // Aggregate product counts per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, isActive: true });
        return {
          ...cat.toObject(),
          id: cat.slug || cat._id.toString(),
          _id: cat._id,
          count,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching categories',
      error: error.message,
    });
  }
};

// @desc    Get single category by slug or id
// @route   GET /api/categories/:idOrSlug
// @access  Public
export const getCategoryByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let category = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const count = await Product.countDocuments({ category: category._id, isActive: true });

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        id: category.slug || category._id.toString(),
        count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching category',
      error: error.message,
    });
  }
};

// @desc    Create a new category (Admin)
// @route   POST /api/categories
// @access  Admin
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, subcategories, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const calculatedSlug =
      slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');

    const existing = await Category.findOne({
      $or: [{ name: name.trim() }, { slug: calculatedSlug }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name or slug already exists',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: calculatedSlug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      subcategories: Array.isArray(subcategories)
        ? subcategories.map((s) => ({
            name: typeof s === 'string' ? s : s.name,
            slug: typeof s === 'string' ? s.toLowerCase().replace(/\s+/g, '-') : s.slug,
            description: s.description || '',
          }))
        : [],
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        ...category.toObject(),
        id: category.slug,
        count: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message,
    });
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:idOrSlug
// @access  Admin
export const updateCategory = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let category = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const { name, slug, description, image, subcategories, isActive, displayOrder } = req.body;

    if (name) category.name = name.trim();
    if (slug) category.slug = slug.trim().toLowerCase();
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (Array.isArray(subcategories)) {
      category.subcategories = subcategories.map((s) => ({
        name: typeof s === 'string' ? s : s.name,
        slug: typeof s === 'string' ? s.toLowerCase().replace(/\s+/g, '-') : s.slug,
        description: s.description || '',
      }));
    }

    await category.save();

    // If slug changed, also update categorySlug in products
    if (slug) {
      await Product.updateMany(
        { category: category._id },
        { categorySlug: category.slug }
      );
    }

    const count = await Product.countDocuments({ category: category._id, isActive: true });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        ...category.toObject(),
        id: category.slug,
        count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message,
    });
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:idOrSlug
// @access  Admin
export const deleteCategory = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let category = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await Category.findByIdAndDelete(category._id);

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" removed successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message,
    });
  }
};
