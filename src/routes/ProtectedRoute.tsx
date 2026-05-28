import { Navigate } from "react-router-dom";    
import { useAuth } from "../context/AuthContext";  
import { SpinnerEmpty } from "@/components/SpinnerComponent";
export default function ProtectedRoute({children} : {children: React.ReactNode;}){
    const {currentUser, loading} = useAuth();
    if(loading){
        return <SpinnerEmpty/>
    }
    if(!currentUser){
        return <Navigate to="/login" replace/>;
    }
    return children;
}