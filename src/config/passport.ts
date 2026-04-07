import "dotenv/config"

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email: string, password: string, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        // block Google-only users
        if (!user.password) {
          return done(null, false, { message: "Use Google login" });
        }
        const match = await bcryptjs.compare(password, user.password);

        if (!match) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: process.env.CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const googleId = profile.id;

        if (!email) return done(null, false);

        let user = await prisma.user.findUnique({
          where: { email },
        });

        // create if not exists
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              user_name: profile?.displayName || "No Name",
              googleId: googleId,
            },
          });
        } else {
          // update googleId if missing
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { email },
              data: { googleId: googleId },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// 


// passport.serializeUser((user: any, done) => {
//   // Passport saves this ID into the session
//   done(null, user.id); 
// });

// passport.deserializeUser(async (id: any, done) => {
//   try {
//     // Convert the ID to a Number specifically for Prisma Int types
//     const userId = typeof id === "string" ? parseInt(id, 10) : id;

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) return done(null, false);

//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });





passport.serializeUser((user: any, done) => {
  // Passport saves this ID into the session
  done(null, user.id); 
});

passport.deserializeUser(async (id: any, done) => {
  try {
    // Convert the ID to a Number specifically for Prisma Int types
    const userId = typeof id === "string" ? parseInt(id, 10) : id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return done(null, false);

    done(null, user);
  } catch (error) {
    done(error);
  }
});
export default passport ;