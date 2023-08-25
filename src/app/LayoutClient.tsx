import { useQuery } from '@apollo/client'
import { useAtom } from 'jotai'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'

import { CookieService } from '@/auth/cookie.service'
import { GET_AUTH } from '@/auth/queries'
import { TypeStore, userAtom } from '@/auth/store'
import Loader from '@/ui/loader/Loader'

export default function LayoutClient({ children }: PropsWithChildren) {
	const [authUser, setAuthUser] = useAtom(userAtom)

	const { loading } = useQuery(GET_AUTH, {
		skip: !CookieService.getAccessToken(),
		onCompleted(data: { newTokens: TypeStore }) {
			const response = data?.newTokens

			CookieService.setAccessToken(response.accessToken || '')
			setAuthUser(response.user)
		},
	})

	if (loading) return <Loader />

	return (
		<>
			<header
				style={{
					display: 'flex',
					gap: 24,
				}}
			>
				<Link href='/'>Home</Link>
				<Link href='/login'>Login</Link>
				<Link href='/student/profile'>Profile</Link>
				<span>{authUser?.role}</span>
			</header>
			<main
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '70vh',
				}}
			>
				{children}
			</main>
		</>
	)
}
