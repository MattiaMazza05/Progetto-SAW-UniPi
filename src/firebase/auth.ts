import{
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./config";
export function registerUser(email: string, password: string){
    return createUserWithEmailAndPassword(auth, email, password);
}

export function loginUser(email: string, password: string){
    return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser(){
    signOut(auth);
}

export function authState(callback: (user: any) => void){
    return onAuthStateChanged(auth, callback);
}

