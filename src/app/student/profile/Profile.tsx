'use client'

import { gql, useQuery } from '@apollo/client'

interface IProfile {}

const GET_PROFILE = gql`
	query profile {
		profile {
			email
		}
	}
`

export default function Profile({}: IProfile) {
	const { data, loading } = useQuery(GET_PROFILE)

	return (
		<div>
			<h1>Profile</h1>
			<br />
			<b>Email:</b> {loading ? '...' : data?.profile?.email}
		</div>
	)
}
