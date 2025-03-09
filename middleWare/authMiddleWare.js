import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "my_secret_key");    /// here we are decoding the toke using jwt.verify function
    req.user = decoded;                                      /// where we compare the token with the secret key
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden - Invalid Token" });
  }
};

export default authMiddleware;
