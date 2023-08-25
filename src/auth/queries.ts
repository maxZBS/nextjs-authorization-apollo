import { gql } from '@apollo/client'

export const GET_AUTH = gql`
	query newTokens {
		newTokens {
			user {
				email
				isVerified
				role
			}
			accessToken
		}
	}
`
