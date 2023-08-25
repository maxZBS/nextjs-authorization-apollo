import { EnumTokens, TypeNewTokensResponse } from '@/types'
import {
	ApolloClient,
	ApolloLink,
	FetchResult,
	HttpLink,
	InMemoryCache,
	Observable,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { GraphQLError } from 'graphql'
import { GET_AUTH } from './queries'

import { GRAPHQL_SERVER_URL } from '@/constants'
import { CookieService } from './cookie.service'
import { userAtom, userStore } from './store'

const authLink = setContext((_, { headers }) => {
	const accessToken = CookieService.getAccessToken()

	return {
		headers: {
			...headers,
			authorization: accessToken ? `Bearer ${accessToken}` : '',
		},
	}
})

const errorLink = onError(
	({ graphQLErrors, networkError, operation, forward }) => {
		if (graphQLErrors) {
			for (const err of graphQLErrors) {
				switch (err.extensions.code) {
					case 'UNAUTHENTICATED':
						if (operation.operationName === EnumTokens.REFRESH_TOKEN) return

						const observable = new Observable<FetchResult<Record<string, any>>>(
							observer => {
								;(async () => {
									try {
										const accessToken = await refreshToken()

										if (!accessToken) {
											throw new GraphQLError('Empty AccessToken')
										}

										// Retry the failed request
										const subscriber = {
											next: observer.next.bind(observer),
											error: observer.error.bind(observer),
											complete: observer.complete.bind(observer),
										}

										forward(operation).subscribe(subscriber)
									} catch (err) {
										observer.error(err)
									}
								})()
							}
						)

						return observable
				}
			}
		}

		if (networkError) console.log(`[Network error]: ${networkError}`)
	}
)

const httpLink = new HttpLink({
	uri: GRAPHQL_SERVER_URL,
	credentials: 'include',
})

export const apolloClient = new ApolloClient({
	link: ApolloLink.from([errorLink, authLink, httpLink]),
	cache: new InMemoryCache(),
	connectToDevTools: true,
})

const refreshToken = async () => {
	try {
		const response = await apolloClient.query<TypeNewTokensResponse>({
			query: GET_AUTH,
		})

		const authResponse = response.data?.newTokens
		if (authResponse) {
			CookieService.setAccessToken(authResponse.accessToken)
			userStore.set(userAtom, authResponse.user)
		}

		return authResponse.accessToken
	} catch (err) {
		userStore.set(userAtom, null)
		CookieService.removeAccessToken()
		throw err
	}
}
