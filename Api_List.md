#Dev tinder app API
POST /signup
POST /login
POST /logout

ProfileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

connectionRequest
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

userRouter

GET /user/connections
GET /user/feed Gets you the profile of other platform

status: ignore,interested,accepted,rejected,

Create login API
Compare passwords and throw errors if email or password is invalid
install cookie-parser
just send a dummy cookie to user
create GET /profile API and check if you get the cookie back
install jsonwebtoken
In login API, after email and password validation, create a JWT token and send it to user in cookies
read the cookies inside your profile API and find the logged in user
userAuth Middleware
Add the userAuth middle ware to profile API and a new sendConnectionRequest API
Set the expiry of JWT token and cookies to 7 days
Create userSchema method to getJWT()
Create UserSchema method to comparePassword(passwordInputByUser)
Explore tinder APIs
Create a list all API you can think of in Tinder
Group multiple routes under respective routers