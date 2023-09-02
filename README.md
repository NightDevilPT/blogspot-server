# [BlogSphere](https://blogspot-server.vercel.app/)

## Description
This is a BlogSphere web server API.

In This Web Api you can Add user, Update user, and Get another user Data By Used ID.

## Package Used


#### 1. [**CORS**]() for Some Specific Web page to access this Server.
#### 2. [**BCRYPT**]() for used to convert your password that will convert your password in Hash Password.
#### 3. [**EXPRESS**]() for Developing APIs.
#### 4. [**JSONWEBTOKEN**]() is used to convert User data to Token. 
#### 5. [**NODEMAILER**]() for send a mail to user.
#### 6. [**MONGOOSE**]()  for connecting MongoDB Atlas or Add,Remove,Update data.


## Model Image
![Screenshot from 2023-06-09 18-52-24](/public/model.png)

## User Routes
1. GET Method [***https://blogspot-server.vercel.app/user***]()
	- This route get user id as Param in URL to return User data

2. GET Method [***https://blogspot-server.vercel.app/user/profile***]()
	- This route get user Token in Header of URL to return User data

3. GET Method [***https://blogspot-server.vercel.app/user/login***]()
	- This route check user [Email or Password] to verify user and return a JWT token as response if user available or User email successfully verified.

4. POST Method [***https://blogspot-server.vercel.app/user/create***]()
	- This route add a new user (firstname, lastname, gender, avtar, email, password) data in [**MongoDB Atlas**]()

5. PUT Method [***https://blogspot-server.vercel.app/user/verify***]()
	- This route take a token as params in URL to verify user if user token verified then user data updated as verified Email.

6. PUT Method [***https://blogspot-server.vercel.app/user/update***]()
	- This route take user token in header to verify user if user successfully verified then user data will update.

7. PUT Method [***https://blogspot-server.vercel.app/user/updatedsaved***]()
	- This route take a Header token to verify user and **Blog ID** as Params in URL. if header token verified successfully then **Blog ID** ***Add / Remove*** from user Data.

8. PUT Method [***https://blogspot-server.vercel.app/user/updatefollower***]()
	- This route is Protected and take a token from Header of URL to verify User
	- This route also take **User ID** as Params in URL. if user verified successfully then Updating User Following Array List and Another user Followers Array List.

## Blogs Route
1. GET Method [***https://blogspot-server.vercel.app/blog***]()
	- This Route take a **Blog ID** as Params in URL. If this blog id data available in Database then Blog Data return as response.

2. POST Method [***https://blogspot-server.vercel.app/blog/create***]()
	- This route is Protected and take a token from Header of URL to verify User
	- if user verified successfully then new blog is added in [**MongoDB Atlas**]() and automatically generated **Blog ID** added in User blogs Array List.

3. PUT Method [***https://blogspot-server.vercel.app/blog/update***]()
	- This route is Protected and take a token from Header of URL to verify User
	- This route also take a Blog ID as Params in URL if blog id is available then blog is update

4. Get Method [***https://blogspot-server.vercel.app/blog/search***]()
	- This is public route you don't need to signin or login to get blogs data
	- This route take optional argument as Params in URL (Tags for Searching Blogs, Limit for per page Blog, Page to specific page of blogs)

5. PUT Method [***https://blogspot-server.vercel.app/blog/updatelike***]()
	- This route is Protected and take a token from Header of URL to verify User
	- This route is used to add User ID in blogs Like Array list and after that the blog ID is added in User Liked Array List.