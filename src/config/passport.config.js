const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../dao/models/userModels');
const { JWT_SECRET } = require('../utils/jwt.utils');

const initializePassport = () => {
    // Estrategia Local
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user || !user.comparePassword(password)) {
                    return done(null, false, { message: 'Credenciales inválidas' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Estrategia JWT
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
    }, async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
};

module.exports = initializePassport;