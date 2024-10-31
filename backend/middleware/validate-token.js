import jwt from "jsonwebtoken";

 const validateToken = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // Extract the Bearer token
  } else if (req.cookies.authToken) {
    // Check for token in cookies
    token = req.cookies.authToken;
  }
  if (!token) {
    const error = new Error("User not authorized or token is missing.");
    error.status = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({ sucesss: false, message: error.message });
  }
};

export default validateToken
