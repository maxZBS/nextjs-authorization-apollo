'use client'

import { CookieService } from '@/auth/cookie.service'
import { userAtom } from '@/auth/store'
import { GRAPHQL_SERVER_URL } from '@/constants'
import { PAGES } from '@/middleware'
import { useAtom } from 'jotai'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface IUserInfo {}

export default function UserInfo({}: IUserInfo) {
	const [user, setAuthUser] = useAtom(userAtom)
	const { replace } = useRouter()

	if (!user) return <Link href='/login'>Go to login</Link>

	return (
		<div>
			<h1>CURRENT USER: </h1>
			<br />
			Email: {user?.email} <br />
			Role: {user?.role} <br />
			<br />
			<button
				onClick={() => {
					fetch(GRAPHQL_SERVER_URL, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include',
						body: JSON.stringify({ query: 'mutation Logout { logout }' }),
					})
						.then(response => response.json())
						.then(data => {
							if (data.errors) {
								console.error('GraphQL errors:', data.errors)
							} else {
								setAuthUser(null)
								CookieService.removeAccessToken()

								replace(PAGES.login)
							}
						})
						.catch(error => {
							console.error('Network error:', error)
						})
				}}
			>
				Logout
			</button>
		</div>
	)
}
