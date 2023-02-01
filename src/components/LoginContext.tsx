import React from "react";

interface loginContext {
    login: any;
    setLogin: any;
}

export const LoginContext = React.createContext<loginContext>({login: false, setLogin: null});