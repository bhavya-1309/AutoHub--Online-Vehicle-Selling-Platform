// Protect routes - user must be logged in
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

module.exports = { requireLogin };
