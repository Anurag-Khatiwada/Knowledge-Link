import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUnFormData } from "@/config";
import { registerService, loginService, checkAuth } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({children}){

    const [signInFormData, setSignInFormData] = useState(initialSignInFormData)
    const [signUpFormData, setSignUpFormData] = useState(initialSignUnFormData)
    const [loading, SetLoading] = useState(true)

    const navigate = useNavigate()

    const [auth, setAuth] = useState({
        authenticate : false,
        user: null
    })

    const handleRegisterUser = async (e) =>{
        e.preventDefault()
        const data = await registerService(signUpFormData);
        if(data.data.success){
            alert("Account created successfully");
            window.reload()
        }
}
const handleLoginUser = async (e) =>{
    e.preventDefault()
    const data = await loginService(signInFormData);
    if(data.success){
        sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken) )
        setAuth({
            authenticate: true,
            user: data.data.user
        })
        SetLoading(false)
    }else{
        setAuth({
            authenticate: false,
            user: null
        })
    }
}

const checkAuthUser = async () => {
    try {
        const data = await checkAuth();
        console.log("Auth Check Response:", data); // Log response
        if (data.success) {
            console.log("User Role:", data.data.user.role); // Log user role
            setAuth({
                authenticate: true,
                user: data.data.user
            });
        } else {
            setAuth({
                authenticate: false,
                user: null
            });
        }
    } catch (err) {
        console.error("Error checking auth:", err);
        setAuth({
            authenticate: false,
            user: null
        });
    } finally {
        SetLoading(false); // Ensure loading is set to false after check
    }
};
const resetCredentials=()=>{
    setAuth({
        authenticate: false,
        user: null
    });
}

 useEffect(()=>{
    checkAuthUser();
 },[])

 console.log(auth)

    return <AuthContext.Provider value={{
        signInFormData, setSignInFormData,
        signUpFormData, setSignUpFormData,
         handleRegisterUser, handleLoginUser, 
         auth , resetCredentials
    }}>{loading?<Skeleton/>: children}</AuthContext.Provider>
}