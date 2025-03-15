import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${
          process.env.API_URL || "http://localhost:5000"
        }/api/users/auth/google/callback`,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // Update last login time
            user.lastLogin = new Date();
            await user.save();
          } else {
            // Get email from profile
            const email =
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "";

            // Check if email is already in use
            const existingUser = await User.findOne({ email });

            if (existingUser) {
              // Link Google account to existing user
              existingUser.googleId = profile.id;
              existingUser.isEmailVerified = true; // Email is verified through Google
              existingUser.lastLogin = new Date();

              // Fix for TypeScript error - handle null case explicitly
              if (
                profile.photos &&
                profile.photos[0] &&
                profile.photos[0].value
              ) {
                existingUser.profilePicture = profile.photos[0].value;
              }

              await existingUser.save();
              user = existingUser;
            } else {
              // Create new user
              user = await User.create({
                username:
                  profile.displayName.replace(/\s+/g, "") +
                  Math.floor(Math.random() * 1000),
                email: email,
                googleId: profile.id,
                isEmailVerified: true,
                profilePicture:
                  profile.photos && profile.photos[0]
                    ? profile.photos[0].value
                    : undefined, // Using undefined instead of null
                lastLogin: new Date(),
                role: "user",
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
};
