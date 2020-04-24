import React,{useEffect,useState} from "react"
import "../style.css"
import fire from "./firebase"
import {CircularProgress} from "@material-ui/core"


export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pending, setPending] = useState(true);
  
    useEffect(() => {
        fire.auth().onAuthStateChanged((user)=>{
            setCurrentUser(user)
        setPending(false)
        console.log(currentUser)
        })
    }, []);
  
    if(pending){
      return (<CircularProgress id="loader"/>)
    }
  
    return (
      <AuthContext.Provider
        value={{
          currentUser
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };