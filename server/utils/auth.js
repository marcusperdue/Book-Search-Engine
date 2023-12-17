const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');  

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req) {
    // allows token to be sent via  req.query or headers
    let token = req.headers.authorization;

    if (!token) {
      throw new AuthenticationError('You have no token!');
    }
    token = token.replace('Bearer ', '');
    
    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      return {user: data};
    } catch {
      console.log('Invalid token');
      throw new AuthenticationError('Invalid token'); 
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
