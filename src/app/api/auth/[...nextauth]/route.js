import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import User from "@/models/user"
import dbConnect from "@/lib/dbConnect"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                // Connect to database
                await dbConnect();

                // Check if user already exists
                let existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    // Create new user with Google auth
                    existingUser = await User.create({
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        googleId: account.providerAccountId,
                        provider: 'google',
                        // Generate a random password for Google users (they won't use it)
                        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
                    });
                    console.log('✅ New Google user created:', existingUser.email);
                } else {
                    // Update existing user with Google info if not already set
                    if (!existingUser.googleId) {
                        existingUser.googleId = account.providerAccountId;
                        if (!existingUser.provider || existingUser.provider === 'credentials') {
                            existingUser.provider = 'google';
                        }
                        existingUser.name = user.name || existingUser.name;
                        existingUser.image = user.image || existingUser.image;
                        await existingUser.save();
                        console.log('✅ Existing user linked with Google:', existingUser.email);
                    } else {
                        console.log('✅ Google user logged in:', existingUser.email);
                    }
                }

                return true;
            } catch (error) {
                console.error('❌ Error in signIn callback:', error);
                return false;
            }
        },
        async session({ session, token }) {
            try {
                await dbConnect();

                // Get user from database
                const user = await User.findOne({ email: session.user.email });

                if (user) {
                    session.user.id = user._id.toString();
                    session.user.name = user.name;
                    session.user.image = user.image;
                    session.user.provider = user.provider;
                }

                return session;
            } catch (error) {
                console.error('❌ Error in session callback:', error);
                return session;
            }
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 