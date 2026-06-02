import { Navigate, Outlet } from "react-router-dom";    
import { useAuth } from "../context/AuthContext";  
import { SpinnerEmpty } from "@/components/SpinnerComponent";
export default function ProtectedRoute(){
    const {currentUser, loading} = useAuth();
    if(loading){
        return <SpinnerEmpty/>
    }
    if(!currentUser){
        return <Navigate to="/login" replace/>;
    }
    return <Outlet/>;
}