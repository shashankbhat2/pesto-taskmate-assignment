
import { fetchAuthenticatedUser, login, logout, signup } from "@/lib/fetch";
import { AuthContextType, User } from "@/type";
import { createContext, ReactNode, useState, useEffect } from "react"
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";


export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate()

    const queryClient = useQueryClient();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const userData = await fetchAuthenticatedUser();
                setIsAuthenticated(true);
                setUser(userData.user);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifyUser();
    }, [queryClient]);



    const loginMutation = useMutation(login, {
        onSuccess: async (data) => {
            setIsAuthenticated(true);
            const userData = await fetchAuthenticatedUser(); 
            setUser(userData.user); 
            navigate('/dashboard');
            toast.success("Logged in successfully")
        },
        onError: (error: any) => {
            toast.error("Invalid credentials");
        }
    });

    const signupMutation = useMutation(signup, {
        onSuccess: async () => {
            setIsAuthenticated(true);
            const userData = await fetchAuthenticatedUser();
            setUser(userData.user); 
            navigate('/dashboard');
        },
        onError: (error: any) => {
            toast.error("Something went wrong");
        }
    });

    const logoutFunction = async () => {
        await logout();
        setIsAuthenticated(false);
        setUser(null); 
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, loginMutation, logout: logoutFunction, signupMutation, user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};