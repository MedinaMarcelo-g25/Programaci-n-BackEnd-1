const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../dao/models/userModel');
const { JWT_SECRET } = require('../utils/jwt.utils');

function initializePassport(passport){
  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      const { first_name, last_name, age } = req.body;
      const normalized = email.toLowerCase().trim();
      const exists = await User.findOne({ email: normalized });
      if (exists) return done(null, false, { message: 'Email ya registrado' });
      const user = await User.create({ first_name, last_name, age, email: normalized, password });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const normalized = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalized });
      if (!user) return done(null, false, { message: 'Credenciales inválidas' });
      const ok = await user.comparePassword(password);
      if (!ok) return done(null, false, { message: 'Credenciales inválidas' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([
      ExtractJWT.fromAuthHeaderAsBearerToken(),
      (req) => req?.cookies?.jwt
    ]),
    secretOrKey: JWT_SECRET
  }, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

module.exports = initializePassport;