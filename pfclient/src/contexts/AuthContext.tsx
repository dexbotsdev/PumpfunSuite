import { useLocalStorage } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { symlink } from 'fs';
import { createContext, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    children?: ReactNode;
}
interface User {
    _id: string;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
    firstName: string;
    lastName: string;
    username: string;
    address: string;
    phoneNumber: string;
    email: string;
    roleId: string;
    roleAlias: string;
    createdAt: string;
    updatedAt: string;
}

interface Permission {
    _id: string;
    createdBy: string;
    updatedBy: string;
    resourceName: string;
    resourceAlias: string;
    roleName: string;
    roleAlias: string;
    isAllowed: boolean;
    isDisabled: boolean;
    roleId: string;
    resourceId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse {
    status: string;
    type: string;
    currentAuthority: string;
    user: User;
    permissions: Permission[];
}


export interface UserLoginData {
    username: string;
    password: string;
}

interface IAuthContextProps {
    user: User | null;
    login: (userLoginData: UserLoginData) => Promise<boolean>;
    logout: () => void;
    authenticated: boolean;
    setAuthenticated: (newState: boolean) => void;
    setAuthToken:(token:string|undefined)=> any;
}

const initialValue = {
    authenticated: false,
    setAuthToken: () => { },
    setAuthenticated: () => { },
    user: null,
    login: async (): Promise<boolean> => false,
    logout: () => { },
}

const AuthContext = createContext<IAuthContextProps>(initialValue)
 
const AuthProvider = ({ children }: Props) => {
    //Initializing an auth state with false value (unauthenticated)
    const [authenticated, setAuthenticated] = useState(initialValue.authenticated)
    const [requestStatus, setRequestStatus] = useState<'pending' | 'complete'>('pending')
    const [user, setUser] = useState<User | null>(null);
    const [userPermissions, setUserPermissions] = useState<Permission[] | null>(null);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [profile, setProfile] = useLocalStorage("profile", null);
    const [token, setToken_] = useState(localStorage.getItem("token"));

    const login = async (userLoginData: UserLoginData): Promise<boolean> => {
        try {
            const { data } = await axios.post("/api/auth/login", userLoginData);
            if (data.status == 'ok') {
                setUser(data.user);
                setUserPermissions(data.permissions)
                setUserToken(data.accessToken);
                setAuthToken(data.accessToken);
                setAuthenticated(true);
                setProfile(data);
                return true;
            } else
                return false;

        } catch (error) {
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/signout");
            setUser(null);
            setUserPermissions(null)
            setUserToken(null);
            setAuthToken(undefined);
            setAuthenticated(false);
            setProfile(null);
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    };
    // Function to set the authentication token
    const setAuthToken = (token: string |undefined) => { 
        if (token) {
            localStorage.setItem("token",token)
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        else
           {
            localStorage.clear();
            delete axios.defaults.headers.common["Authorization"];
            }
    };

  

    // Memoized value of the authentication context
    const contextValue = useMemo(
        () => ({
            token,
            setAuthToken,
        }),
        [token]
    );

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated, user, login, logout,setAuthToken }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth can only be used inside AuthProvider");
    }

    return context;
};

export { AuthContext, AuthProvider }