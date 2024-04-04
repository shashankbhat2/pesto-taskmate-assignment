import { AuthContext } from "@/context/AuthContext"
import { useContext } from "react"

export const useAuth = () => {
    const authContext = useContext(AuthContext)
    if(authContext === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return authContext
}
