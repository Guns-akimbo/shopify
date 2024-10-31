import colors from "colors";

const logger = (req, res, next) => {
  const colorMethods = {
    GET: "green",
    POST: "blue",
    PUT: "yellow",
    DELETE: "red",
  };

  const color = colorMethods[req.method] || white;

  console.log(`${req.method} ${req.protocol} ${req.get("host")}`[color]),
    next();
};

export default logger;
