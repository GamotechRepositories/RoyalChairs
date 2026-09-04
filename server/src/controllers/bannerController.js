import Banner from '../models/Banner.js';

const DEFAULT_HERO_BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85',
    link: '#shop-by-category',
    active: true,
    order: 0,
    type: 'hero',
  },
  {
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=2000&q=85',
    link: '#shop-by-category',
    active: true,
    order: 1,
    type: 'hero',
  },
];

const DEFAULT_NEWCOLL_BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
    order: 0,
    type: 'new_collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
    order: 1,
    type: 'new_collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
    order: 2,
    type: 'new_collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=2000&q=85',
    link: '#new-collection',
    active: true,
    order: 3,
    type: 'new_collection',
  },
];

const DEFAULT_SPOTLIGHT_BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1600&q=85',
    link: '#category-gaming',
    categorySlug: 'gaming',
    title: 'The Sovereign Orthopedic Executive Leather Throne',
    subtitle: 'Master-Crafted Ergonomics & Unmatched Spinal Comfort',
    description:
      'Smart, adaptable design engineered for high-focus professionals and esports champions. Seamlessly elevates your space with dual-density cold-cured foam, 4D adaptive lumbar alignment, and premium breathable leatherette.',
    buttonText: 'SHOP NOW',
    active: true,
    order: 0,
    type: 'spotlight',
  },
];

// @desc    Get banners by type
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req, res) => {
  try {
    const { status, type = 'hero' } = req.query;
    let bannerType = type;
    if (
      bannerType !== 'new_collection' &&
      bannerType !== 'spotlight'
    ) {
      bannerType = 'hero';
    }

    const query = {
      type: bannerType === 'hero' ? { $in: ['hero', null, undefined] } : bannerType,
      ...(status === 'all' ? {} : { active: true }),
    };

    let banners = await Banner.find(query).sort({ order: 1, createdAt: 1 });

    // Seed defaults if table is empty
    if (banners.length === 0 && status !== 'all') {
      const defaults =
        bannerType === 'new_collection'
          ? DEFAULT_NEWCOLL_BANNERS
          : bannerType === 'spotlight'
          ? DEFAULT_SPOTLIGHT_BANNERS
          : DEFAULT_HERO_BANNERS;
      await Banner.insertMany(defaults);
      banners = await Banner.find(query).sort({ order: 1, createdAt: 1 });
    }

    return res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
      error: error.message,
    });
  }
};

// @desc    Save/Sync entire banner list for a specific type
// @route   POST /api/banners
// @access  Admin
export const saveBanners = async (req, res) => {
  try {
    const { banners, type = 'hero' } = req.body;
    let bannerType = type;
    if (
      bannerType !== 'new_collection' &&
      bannerType !== 'spotlight' &&
      bannerType !== 'instagram'
    ) {
      bannerType = 'hero';
    }

    if (!Array.isArray(banners)) {
      return res.status(400).json({
        success: false,
        message: 'Banners array is required',
      });
    }

    // Clear existing banners for this specific type and replace with new list
    if (bannerType === 'hero') {
      await Banner.deleteMany({
        $or: [{ type: 'hero' }, { type: { $exists: false } }, { type: null }],
      });
    } else {
      await Banner.deleteMany({ type: bannerType });
    }

    const docsToInsert = banners.map((b, idx) => ({
      image: b.image,
      link:
        b.link ||
        (bannerType === 'new_collection'
          ? '#new-collection'
          : bannerType === 'instagram'
          ? 'https://instagram.com/royalchairs'
          : '#shop-by-category'),
      title: b.title || '',
      subtitle: b.subtitle || '',
      description: b.description || '',
      buttonText: b.buttonText || 'SHOP NOW',
      categorySlug: b.categorySlug || '',
      type: bannerType,
      active: b.active !== false,
      order: idx,
    }));

    const inserted = await Banner.insertMany(docsToInsert);

    res.status(200).json({
      success: true,
      message: `${bannerType.toUpperCase()} Banners saved and synced successfully`,
      count: inserted.length,
      data: inserted.map((b) => {
        const obj = b.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save banners',
      error: error.message,
    });
  }
};

// @desc    Delete single banner by ID
// @route   DELETE /api/banners/:id
// @access  Admin
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
      error: error.message,
    });
  }
};
