const { default: mongoose } = require('mongoose');
const { CreateNewBlog, UpdateBlogs, SearchBlog, LikeBlog, GetBlogData } = require('../controllers/blog');
const { VerifyHeaderToken } = require('../middleware/middlewares');
const ConnectDB = require('../middleware/ConnectDB');

const blogRouter = require('express').Router();

// ----- Fetching One Blog Data by Using Blog ID
blogRouter.get('/',GetBlogData);

// ----- Updating Blog Data By Using Blog ID
blogRouter.put('/update',VerifyHeaderToken,UpdateBlogs);

// ----- Creating New Blog
blogRouter.post('/create',VerifyHeaderToken,CreateNewBlog);

// ----- Searching Blog By Tags with Page Paginationation and Limit of Data
blogRouter.get('/search',SearchBlog);

// ----- Updating Blog Like
blogRouter.put('/updatelike',VerifyHeaderToken,LikeBlog)


module.exports = blogRouter;