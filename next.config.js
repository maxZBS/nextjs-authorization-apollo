/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		GRAPHQL_SERVER_URL: process.env.GRAPHQL_SERVER_URL,
	},
	experimental: {
		appDir: true,
	},
}

module.exports = nextConfig
