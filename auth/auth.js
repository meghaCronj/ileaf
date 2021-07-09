const passport = require("passport");
const passportJWT = require("passport-jwt");

let JwtStrategy = passportJWT.Strategy;
let ExtractJwt = passportJWT.ExtractJwt;
const User = require("../models/user.model");
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
exports.autherization = () => {
  // console.log("Inside Authorization")
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ _id: jwt_payload.id })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            // console.log("unauthenticated");sa
            return done(null, false);
          }
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    })
  );
};
