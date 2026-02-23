const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const authService = require('../services/auth.service');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0] && profile.emails[0].value;
                const first_name = profile.name ? profile.name.givenName : (profile.displayName || 'User');
                const last_name = profile.name ? profile.name.familyName : '';

                const user = await authService.findOrCreateOAuthUser({
                    googleId: profile.id,
                    email,
                    first_name,
                    last_name,
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: `${process.env.SERVER_URL || 'http://localhost:3000'}/api/auth/twitter/callback`,
        },
        async (token, tokenSecret, profile, done) => {
            try {
                const email = (profile.emails && profile.emails[0] && profile.emails[0].value)
                    || `twitter_${profile.id}@noemail.subex`; // fallback if Twitter withholds email

                const displayName = profile.displayName || profile.username || 'User';
                const nameParts = displayName.split(' ');
                const first_name = nameParts[0];
                const last_name = nameParts.slice(1).join(' ') || nameParts[0];

                const user = await authService.findOrCreateOAuthUser({
                    googleId: null,
                    email,
                    first_name,
                    last_name,
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Minimal session serialization (we use JWT, so sessions are just for the OAuth handshake)
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const db = require('../models');
        const user = await db.User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
