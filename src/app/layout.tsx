import { Providers } from '@/auth/providers'
import { VT323 } from 'next/font/google'
import './globals.css'

export const metadata = {
	title: 'Next auth by RED Group',
}

const fontMono = VT323({
	weight: '400',
	display: 'swap',
	style: ['normal'],
	variable: '--font-mono',
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' className={fontMono.variable}>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
