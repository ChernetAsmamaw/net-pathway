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

          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            console.log("Existing user found with googleId:", user._id);

            // Update last login time
            user.lastLogin = new Date();
            await user.save();
          } else {
            // Get email from profile
            const email =
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : "";

            if (!email) {
              console.error("No email found in Google profile");
              return done(new Error("No email found in Google profile"));
            }

            // Check if email is already in use
            const existingUser = await User.findOne({ email });

            if (existingUser) {
              console.log(
                "Linking Google account to existing user:",
                existingUser._id
              );

              // Link Google account to existing user
              existingUser.googleId = profile.id;
              existingUser.isEmailVerified = true; // Email is verified through Google
              existingUser.lastLogin = new Date();

              // Update profile picture if available
              if (
                profile.photos &&
                profile.photos.length > 0 &&
                profile.photos[0].value
              ) {
                existingUser.profilePicture = profile.photos[0].value;
              }

              await existingUser.save();
              user = existingUser;
            } else {
              console.log("Creating new user from Google profile");

              // Create new user
              user = await User.create({
                username:
                  profile.displayName.replace(/\s+/g, "") +
                  Math.floor(Math.random() * 1000),
                email: email,
                googleId: profile.id,
                isEmailVerified: true,
                profilePicture:
                  profile.photos && profile.photos.length > 0
                    ? profile.photos[0].value
                    : undefined,
                lastLogin: new Date(),
                role: "user",
              });

              console.log("New user created:", user._id);
            }
          }

          return done(null, user);
        } catch (error) {
          console.error("Google auth strategy error:", error);
          return done(error as Error);
        }
      }
    )
  );
};
