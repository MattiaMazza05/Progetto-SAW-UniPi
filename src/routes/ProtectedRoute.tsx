import { Navigate } from "react-router-dom";    
import { useAuth } from "../context/AuthContext";   

export default function ProtectedRoute({children} : {children: React.ReactNode;}){
    const {currentUser, loading} = useAuth();
    if(loading){
        return <p> Caricamento...</p>
    }
    if(!currentUser){
        return <Navigate to="/login" replace/>;
    }
    return children;
}