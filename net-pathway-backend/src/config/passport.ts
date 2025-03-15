import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

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
          console.log("Google profile data:", {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails,
            photos: profile.photos,
          });

          // Get email
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value.toLowerCase()
              : "";

          if (!email) {
            return done(new Error("No email found in Google profile"));
          }

          // Check if user exists by Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            console.log("Existing user found with googleId:", user._id);

            // Update last login time
            user.lastLogin = new Date();
            await user.save();

            return done(null, user);
          }

          // Check if user exists by email
          user = await User.findOne({ email });

          if (user) {
            console.log("Existing user found with email:", user._id);

            // Link Google account to existing user
            user.googleId = profile.id;
            user.isEmailVerified = true;
            user.lastLogin = new Date();

            // Update profile picture if available
            if (profile.photos && profile.photos.length > 0) {
              user.profilePicture = profile.photos[0].value;
            }

            await user.save();
            return done(null, user);
          }

          // Create new user if not found
          console.log("Creating new user from Google profile");
          const username = `${profile.displayName.replace(
            /\s+/g,
            ""
          )}${Math.floor(Math.random() * 1000)}`;

          user = await User.create({
            username,
            email,
            googleId: profile.id,
            isEmailVerified: true,
            profilePicture:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : undefined,
            lastLogin: new Date(),
          });

          console.log("New user created:", user._id);
          return done(null, user);
        } catch (error) {
          console.error("Google auth strategy error:", error);
          return done(error as Error);
        }
      }
    )
  );
};
