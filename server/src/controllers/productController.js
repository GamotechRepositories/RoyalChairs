import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with filtering, search, category & subcategory filters, sort & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      sort,
      minPrice,
      maxPrice,
      isBestSeller,
      isNew,
      isOffer,
      limit = 50,
      page = 1,
    } = req.query;

    const query = { isActive: true };

    // Category filter by slug or ObjectId
    if (category && category !== 'All' && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        query.categorySlug = category.toLowerCase();
      }
    }

    // Subcategory filter
    if (subcategory && subcategory !== 'All' && subcategory !== 'all') {
      query.subCategory = new RegExp(subcategory, 'i');
    }

    // Search query
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { fullDescription: searchRegex },
        { categorySlug: searchRegex },
        { subCategory: searchRegex },
        { sku: searchRegex },
      ];
    }

    // Best Seller / New / Offer flags
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isNew === 'true') query.isNew = true;
    if (isOffer === 'true') query.isOffer = true;

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') sortOptions = { price: 1 };
    if (sort === 'price-high') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'name-asc') sortOptions = { name: 1 };
    if (sort === 'name-desc') sortOptions = { name: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate('category', 'name slug emoji')
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    // Normalize id field for frontend compatibility
    const formatted = products.map((p) => ({
      ...p.toObject(),
      id: p._id.toString(),
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching products',
      error: error.message,
    });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).populate('category', 'name slug description');
    } else {
      product = await Product.findOne({ slug: idOrSlug.toLowerCase() }).populate(
        'category',
        'name slug description'
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Related products from same category
    const relatedProducts = await Product.find({
      categorySlug: product.categorySlug,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(6);

    res.status(200).json({
      success: true,
      data: {
        ...product.toObject(),
        id: product._id.toString(),
      },
      relatedProducts: relatedProducts.map((p) => ({
        ...p.toObject(),
        id: p._id.toString(),
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching product',
      error: error.message,
    });
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      category,
      categorySlug,
      subCategory,
      price,
      originalPrice,
      discountPercent,
      stock,
      description,
      fullDescription,
      features,
      specifications,
      colors,
      mainImage,
      hoverImage,
      galleryImages,
      isBestSeller,
      isNew,
      isOffer,
    } = req.body;

    if (!name || !price || !mainImage) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and main image are required',
      });
    }

    // Resolve category reference
    let catDoc = null;
    if (category && category.match(/^[0-9a-fA-F]{24}$/)) {
      catDoc = await Category.findById(category);
    } else if (categorySlug || category) {
      catDoc = await Category.findOne({ slug: (categorySlug || category).toLowerCase() });
    }

    if (!catDoc) {
      // Fallback find any first category or create one
      catDoc = await Category.findOne();
      if (!catDoc) {
        catDoc = await Category.create({
          name: 'General Seating',
          slug: 'general',
          description: 'Luxury handcrafted seating category.',
        });
      }
    }

    const calculatedSlug =
      slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-') +
        '-' +
        Date.now().toString().slice(-4);

    const calcDiscount = Number(discountPercent) || 0;
    const numPrice = Number(price);
    const numOriginalPrice =
      Number(originalPrice) > numPrice
        ? Number(originalPrice)
        : calcDiscount > 0
        ? Math.round(numPrice / (1 - calcDiscount / 100))
        : numPrice;

    const product = await Product.create({
      name: name.trim(),
      slug: calculatedSlug,
      sku: sku || `RC-${Date.now().toString().slice(-4)}`,
      category: catDoc._id,
      categorySlug: catDoc.slug,
      subCategory: subCategory || 'All',
      variantType: req.body.variantType || (Array.isArray(req.body.variants) && req.body.variants.length > 0 ? 'multi' : 'single'),
      hasVariants: Boolean(req.body.hasVariants || (Array.isArray(req.body.variants) && req.body.variants.length > 0)),
      variants: Array.isArray(req.body.variants) ? req.body.variants : [],
      price: numPrice,
      originalPrice: numOriginalPrice,
      discountPercent: calcDiscount,
      isAvailable: req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : true,
      stock: req.body.isAvailable === false ? 0 : (stock !== undefined ? Number(stock) : 20),
      description: description || '',
      fullDescription: fullDescription || description || '',
      features: Array.isArray(features) ? features : [],
      specifications: specifications || {},
      colors: Array.isArray(colors) && colors.length > 0 ? colors : undefined,
      mainImage,
      hoverImage: hoverImage || mainImage,
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      isBestSeller: Boolean(isBestSeller),
      isNew: isNew !== undefined ? Boolean(isNew) : true,
      isOffer: Boolean(isOffer || calcDiscount > 0),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...product.toObject(),
        id: product._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updates = { ...req.body };

    // If category changed, update category reference and categorySlug
    if (updates.category && updates.category !== product.category.toString()) {
      let catDoc = null;
      if (updates.category.match(/^[0-9a-fA-F]{24}$/)) {
        catDoc = await Category.findById(updates.category);
      } else {
        catDoc = await Category.findOne({ slug: updates.category.toLowerCase() });
      }
      if (catDoc) {
        updates.category = catDoc._id;
        updates.categorySlug = catDoc.slug;
      }
    }

    if (updates.price) updates.price = Number(updates.price);
    if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);
    if (updates.discountPercent !== undefined)
      updates.discountPercent = Number(updates.discountPercent);
    if (updates.isAvailable !== undefined) {
      updates.isAvailable = Boolean(updates.isAvailable);
      if (updates.isAvailable && (updates.stock === undefined || updates.stock === 0)) {
        updates.stock = 20;
      } else if (!updates.isAvailable) {
        updates.stock = 0;
      }
    }
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        ...updatedProduct.toObject(),
        id: updatedProduct._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

// @desc    Quick stock update (Admin)
// @route   PATCH /api/products/:id/stock
// @access  Admin
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, delta } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (delta !== undefined) {
      product.stock = Math.max(0, product.stock + Number(delta));
    } else if (stock !== undefined) {
      product.stock = Math.max(0, Number(stock));
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product stock updated',
      stock: product.stock,
      id: product._id.toString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message,
    });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" removed successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};
