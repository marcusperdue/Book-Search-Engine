const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Function for our authenticated routes
  authMiddleware: function (req) {
    // Allows token to be sent via req.query or headers
    const token = req.headers.authorization || req.query.token;

    if (!token) {
      throw new AuthenticationError('You have no token!');
    }

    try {
      // Verify token and get user data out of it
      const { data } = jwt.verify(token, secret);
      return { user: data };
    } catch (err) {
      console.error('Invalid token:', err.message);
      throw new AuthenticationError('Invalid token');
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
