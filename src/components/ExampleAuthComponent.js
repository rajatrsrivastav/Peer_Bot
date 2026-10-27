
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function ExampleAuthComponent() {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <p>Loading...</p>
    }

    if (session) {
        return (
            <div>
                <p>Signed in as {session.user.email}</p>
                <p>Name: {session.user.name}</p>
                {session.user.image && (
                    <Image src={session.user.image} alt="Profile" width={48} height={48} />
                )}
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        )
    }

    return (
        <div>
            <p>Not signed in</p>
            <button onClick={() => signIn('google')}>Sign in with Google</button>
        </div>
    )
}

// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'
// 
// export default async function ServerComponent() {
//     const session = await getServerSession(authOptions)
//     
//     if (!session) {
//         return <p>Not authenticated</p>
//     }
//     
//     return <p>Welcome {session.user.email}</p>
// }
