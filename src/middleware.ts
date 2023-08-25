import { gql } from '@apollo/client'
import { NextResponse, type NextRequest } from 'next/server'
import { GRAPHQL_SERVER_URL } from './constants'
import { EnumTokens, EnumUserRole, TypeAuth } from './types'

export const PAGES = {
	login: '/login',
	student: '/student',
	admin: '/manage',
}

export async function middleware(request: NextRequest) {
	const refreshToken = getCookie(request, EnumTokens.REFRESH_TOKEN)

	const isAuthPage = request.url.includes(PAGES.login)

	if (isAuthPage) {
		if (refreshToken) {
			return NextResponse.redirect(new URL(PAGES.student, request.url))
		}

		return NextResponse.next()
	}

	const isAdminPage = request.url.includes(PAGES.admin)

	if (!refreshToken) {
		return NextResponse.redirect(
			new URL(isAdminPage ? '/404' : PAGES.login, request.url)
		)
	}

	try {
		const data = await getRole(refreshToken)

		if (data?.role === EnumUserRole.Admin) return NextResponse.next()

		if (isAdminPage) {
			return NextResponse.rewrite(new URL('/404', request.url))
		}

		return NextResponse.next()
	} catch (error) {
		request.cookies.delete(EnumTokens.ACCESS_TOKEN)
		return NextResponse.redirect(new URL(PAGES.login, request.url))
	}
}

export const config = {
	matcher: ['/student/:path*', '/manage/:path*', '/login'],
}

const GET_ROLE = gql`
	query getRole {
		newTokens {
			user {
				role
			}
		}
	}
`

export const getRole = async (refreshToken = '') => {
	const query = GET_ROLE.loc?.source.body

	return fetch(GRAPHQL_SERVER_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			refreshToken,
		},
		body: JSON.stringify({ query }),
	})
		.then(response => response.json())
		.then(data => {
			if (data.errors) {
				console.error('GraphQL errors:', data.errors)
			} else {
				return (data?.data?.newTokens as TypeAuth)?.user
			}
		})
		.catch(error => {
			console.log(error)
			throw error
		})
}

const getCookie = (req: NextRequest, name: EnumTokens) =>
	req.cookies.get(name)?.value
