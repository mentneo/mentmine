module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Users API is working'
  });
};
