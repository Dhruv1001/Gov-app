const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
      req.user = decoded;
      next(); // Proceed to the next middleware or route
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
  