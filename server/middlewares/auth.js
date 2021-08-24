const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({ message: "No token Provided" });

  const parts = authHeader.split(" ");

  if (!parts.length === 2)
    return res.status(401).send({ message: "token error" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ message: "token malformatted" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "token expired" });
      }
      return res.status(401).send({ message: "token invalid" });
    }

    req.userId = decoded.id;

    return next();
  });
};
