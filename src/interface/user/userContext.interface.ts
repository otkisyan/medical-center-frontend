import { IUserProfile } from "./userProfile.interface"

export interface IUserContext {
    userProfile: IUserProfile | null
    //register: (username: string, password: string) => void
    login: (username: string, password: string) => void
    logout: () => void
    isLoggedIn: () => boolean
}