const ConnectDB = require('../middleware/ConnectDB');
const { VerifyToken } = require('../libs/JwtToken');
const blogModel = require("../models/blogModel");
const userModel = require('../models/userModel');



// ----- Get 1 Blog Data
exports.GetBlogData = async (req, res) => {
    const { blogId } = req.query;
    if (!blogId) {

        return res.status(404).json({
            success: false,
            error: true,
            message: 'blog not found'
        });
    }

    try {
        const findBlog = await blogModel.findById(blogId);
        if (!findBlog) {

            return res.status(404).json({
                success: false,
                error: true,
                message: 'blog not found'
            });
        }


        return res.status(200).json({
            success: true,
            error: false,
            data: findBlog,
            message: 'successfully fecthed blog'
        })
    } catch (err) {

        return res.status(500).json({
            success: false,
            error: true,
            message: 'Internal Server Error'
        })
    }
}

// ----- Fetch Blogs
exports.SearchBlog = async (req, res) => {
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    const userId = req.query.userId;

    if (page < 0) {

        return res.status(22).json({
            success: false,
            error: true,
            message: 'Invalid page: Pages start at 1. They are expected to be an integer.'
        })
    }
    if (!page) {
        page = 1;
    }
    if (limit < 0) {
        return res.status(404).json({
            success: false,
            error: true,
            message: 'Invalid page: Limit start at 1. They are expected to be an integer.'
        });
    }
    if (!limit) {
        limit = 10;
    }

    const tagsQuery = req.query.tags ? req.query.tags.split(',').map((items, index) => {
        return { tags: items }
    }) : null;

    try {
        const findBlog = tagsQuery ? await blogModel.find({ $or: tagsQuery, privacy: 'public' }) : await blogModel.find({ privacy: 'public' });
        const totalResults = findBlog.length;
        const pageCount = (totalResults % limit > 0) ? parseInt(totalResults / limit) + 1 : parseInt(totalResults / limit)

        if (pageCount <= 0) {
            return res.status(200).json({
                success: true,
                error: false,
                message: 'Blog not Found.'
            })
        }

        if (page > pageCount) {
            return res.status(404).json({
                success: false,
                error: true,
                message: 'Invalid Page: Data not available in this Page.'
            })
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const filteredData = findBlog.slice(startIndex, endIndex);

        const results = {
            data: filteredData,
            totalResults,
            totalPage: pageCount,
            currentPage: page,
        };

        if (page > 0) {
            results['previous'] = page - 1
        }
        if (page + 1 <= pageCount) {
            results['next'] = page + 1
        }

        return res.status(200).json({
            success: true,
            error: false,
            results
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: true,
            message: 'Internal Server Error'
        })
    }
}


// ------- All Request Required Header ( User ) Token
// ----- Create New Blogs
exports.CreateNewBlog = async (req, res) => {
    const { tokenData } = res;
    const data = req.body;

    try {
        const findUser = await userModel.findById(tokenData.id);
        const newBlog = await blogModel.create({ ...data, tags: data.tags, userId: findUser._id });
        const updateUserBlog = await userModel.findByIdAndUpdate(findUser._id, { blogs: [...findUser.blogs, newBlog._id] });


        return res.status(201).json({
            success: true,
            error: false,
            message: 'Blog successfully added'
        });
    } catch (err) {

        return res.status(500).json({
            success: false,
            error: true,
            message: 'Internal Server Error'
        });
    }
}

// ----- Update Blogs
exports.UpdateBlogs = async (req, res) => {
    const { blogId } = req.query;
    const data = req.body;

    if (!blogId) {

        return res.status(404).json({
            success: false,
            error: true,
            message: 'blog not found'
        });
    }

    try {
        const updateBlog = await blogModel.findByIdAndUpdate(blogId, { ...data });

        if (!updateBlog) {

            return res.status(404).json({
                success: false,
                error: true,
                message: 'Blog not found'
            });
        }


        return res.status(201).json({
            success: true,
            error: false,
            message: 'Blog successfully updated'
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: true,
            message: 'Database Connection Error'
        });
    }
}


// ----- Like Blogs
exports.LikeBlog = async (req, res) => {
    const { blogId } = req.query;
    const { tokenData } = res;

    if (!blogId) {

        return res.status(404).json({
            success: false,
            error: true,
            message: 'blog not found'
        });
    }

    try {
        const findBlog = await blogModel.findById(blogId);
        const findUser = await userModel.findById(tokenData.id);

        if (!findBlog) {

            return res.status(404).json({
                success: false,
                error: true,
                message: 'blog not found'
            })
        }

        if (findBlog.likes.includes(findUser._id)) {
            const indexOfLikeBlog = await findBlog.likes.indexOf(findUser._id);
            const indexOfLikeUser = await findUser.liked.indexOf(findBlog._id);

            const removeLikeFromBlog = findBlog.likes.filter((items, index) => {
                if (items !== findUser._id && index !== findUser.liked.indexOf(findBlog._id)) {
                    return items;
                }
            })
            const removeLikeFromUser = findUser.liked.filter((items, index) => {
                if (items !== findBlog._id && index !== findBlog.likes.indexOf(findUser._id)) {
                    return items;
                }
            });

            const updateBlogLikes = await blogModel.findByIdAndUpdate(findBlog._id, { likes: removeLikeFromBlog });
            const updateUserLikes = await userModel.findByIdAndUpdate(findUser._id, { liked: removeLikeFromUser });


            return res.status(200).json({
                success: true,
                error: false,
                message: 'successfully updated'
            });
        }

        const addNewLikeInBlog = await blogModel.findByIdAndUpdate(findBlog._id, { likes: [...findBlog.likes, findUser._id] });
        const addNewLikeInUser = await userModel.findByIdAndUpdate(findUser._id, { liked: [...findUser.liked, findBlog._id] });


        return res.status(200).json({
            success: true,
            error: false,
            message: 'successfully liked'
        });
    } catch (err) {

        return res.status(500).json({
            success: false,
            error: true,
            message: 'Internal Server Error'
        })
    }
}


