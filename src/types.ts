export enum EnumTokens {
	ACCESS_TOKEN = 'accessToken',
	REFRESH_TOKEN = 'refreshToken',
}

export enum EnumUserRole {
	Admin = 'ADMIN',
	Editor = 'EDITOR',
	Student = 'STUDENT',
}

export interface IUser {
	id: string
	email: string
	role: EnumUserRole
}

export type TypeAuth = {
	user: IUser | null
	accessToken: string | null
}

export type TypeNewTokensResponse = {
	newTokens: TypeAuth
}
