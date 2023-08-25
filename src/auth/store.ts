import type { IUser } from '@/types'
import { atom, createStore } from 'jotai'

export type TypeAuthUser = IUser | null
export type TypeStore = {
	user: TypeAuthUser
	accessToken: string | null
}

export const userAtom = atom<TypeAuthUser>(null)
export const userStore = createStore()
