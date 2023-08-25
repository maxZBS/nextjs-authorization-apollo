'use client'

import { CookieService } from '@/auth/cookie.service'
import { GET_AUTH } from '@/auth/queries'
import { userAtom } from '@/auth/store'
import { gql, useMutation } from '@apollo/client'
import { useSetAtom } from 'jotai'
import type { Metadata } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export const metadata: Metadata = {
	title: 'Login',
}

const LOGIN_MUTATION = gql`
	mutation Login($data: AuthInput!) {
		login(data: $data) {
			user {
				id
				email
				role
			}
			accessToken
		}
	}
`

export default function Login() {
	const [email, setEmail] = useState('test@test.ru')
	const [password, setPassword] = useState('123456')

	const [login] = useMutation(LOGIN_MUTATION, {
		variables: {
			data: {
				email,
				password,
			},
		},
		refetchQueries: [GET_AUTH],
	})

	const { replace } = useRouter()
	const setAuth = useSetAtom(userAtom)

	const handleLogin = async () => {
		if (!email || !password) {
			alert('Please enter data!')
			return
		}

		toast.promise(login(), {
			error: 'Error login',
			loading: 'Loading...',
			success: data => {
				const response = data?.data?.login
				if (!response) throw new Error('Error login')

				setAuth(response.user)
				CookieService.setAccessToken(response.accessToken)

				replace('/')
				return 'Successful login'
			},
		})
	}

	return (
		<div>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={e => setEmail(e.target.value)}
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<button onClick={() => handleLogin()}>Login</button>
		</div>
	)
}
