'use client'

import { ApolloProvider } from '@apollo/client'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { Toaster } from 'react-hot-toast'
import { apolloClient } from './apollo-client'

import { Provider as JotaiProvider } from 'jotai'
import dynamic from 'next/dynamic'
import { userStore } from './store'

const LayoutClient = dynamic(() => import('@/app/LayoutClient'), { ssr: false })

type Props = {
	children?: React.ReactNode
}

if (true) {
	// Adds messages only in a dev environment
	loadDevMessages()
	loadErrorMessages()
}

export const Providers = ({ children }: Props) => {
	return (
		<ApolloProvider client={apolloClient}>
			<JotaiProvider store={userStore}>
				<LayoutClient>{children}</LayoutClient>
				<Toaster position='top-center' reverseOrder={false} />
			</JotaiProvider>
		</ApolloProvider>
	)
}
