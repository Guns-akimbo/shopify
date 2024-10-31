const error = (err, req, res, next) => {
  console.log("error handler");
  if (err.status) {
    res.status(err.status).json({ success: false, message: err.message });
  } else {
    res.status(500).json({ message: err.message });
  }
};

export default error;
