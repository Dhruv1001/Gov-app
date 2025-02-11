const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
      }

      const token = authHeader.split(" ")[1]; 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 

      // Check if user has required role
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: You don't have access to this resource." });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token." });
    }
  };
};

module.exports = authMiddleware;




// const authMiddleware = (req, res, next) => {
//   const authHeader = req.header("Authorization");
  
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Access denied. No token provided." });
//   }

//   const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach decoded user info to `req.user`
//     next(); // Move to the next middleware or route
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token." });
//   }
// };
