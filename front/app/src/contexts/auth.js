import React, { Component, useContext, useEffect, useState } from "react";
import { checkSession, createSession, deleteSession } from "../apis/session";
import { Redirect, useHistory, withRouter } from "react-router-dom";
import { createContext } from "react";
import { SnackbarContext } from "./snackBar";
import { CircularProgress, LinearProgress, Stack } from "@mui/material";
import { PageLoadingCircle } from "../components/shared/commonPatrs";
import { BadgeContext } from "./badge";
import { ConfigContext } from "./config";
import { InitialLoading } from "../components/signin/initialLoading";

export const AuthContext = createContext()

const initialState = {
  loading: "loading",
  loggedIn: false,
  chief: false,
  name: ""
}


// const initialState = {
//   loading: "end",
//   loggedIn: true,
//   chief: true,
//   name: ""
// }


// -------------------login---------

export const AuthProvider = ({children}) => {

  const [state, setState] = useState(initialState);
  const history = useHistory();

  const sb = useContext(SnackbarContext);
  const badge = useContext(BadgeContext);
  const orgConfig = useContext(ConfigContext);
  
    const login = (params) =>{
        setState({loading: "initialLoading"})
        createSession(params)
        .then(res => {
           switchLogin(res.data)
           sb.setSnackBar({
            open: true,
            variant: "success",
            content: `${res.data.name}でログインしました`
          })
          }
        )
        .catch((e) => {
          console.log(e)
          switch(e.response.status){
          case 401:
            history.push("/login")
            sb.setSnackBar({
              open: true,
              variant: "error",
              content: "メールアドレスかパスワードが間違っています"
            })
            break
          case 403:
            history.push("/login")
            sb.setSnackBar({
              open: true,
              variant: "error",
              content: "すでにログインされています。"
            })
            break
          }
          setState({loading: "end"})
        })

    }

     const logout = () => {
        deleteSession()
        .then(res => {
          if(res.status == 200)
            {
            history.push("/login")
            setState({
              loggedIn: false,
              loading: "end"})
            sessionStorage.clear()
           }
        }
        )
        sb.setSnackBar({
          open: true,
          variant: "success",
          content: "ログアウトしました"
        })
    }

    const sessionForbidden = () => {
      setState({
        loggedIn:false,
        loading: "end"})
      sessionStorage.clear()
      sb.setSnackBar({
        open: true,
        variant: "error",
        content: "ログイン情報が確認できませんでした。"
      })
    }

    const switchLogin = (data) => {
      if(data.chief){
        initialSetting(data)
        history.push("/Dashboard")
      }else{
        setState({
          loading: "end",
          loggedIn: true,
          name: data.name,
          chief: data.chief})
        history.push("/employeeDashboard")
      }

    }

    const initialSetting = (data) => {
      setState({...state,
        loading: "end",
        loggedIn: true,
        name: data.name,
        chief: data.chief
      }) 
      if(!data.chief){return}
      orgConfig.setParams({
        ...data.config,
        orgName: data.orgName,
        orgAddress: data.orgAddress
      })
      badge.setBadge(data.badges)

    }

      
  useEffect(() => {
    checkSession()
    .then(res => {
      console.log(res.data)
      initialSetting(res.data)
    })
    .catch((e) => {
      console.log(e.response)
      if (e.response.status === 403) {
       sessionForbidden()
      } else {
        throw e;
      }
    })
  },[])

  const SwitchRender = () => {
    switch(state.loading){
      case "loading":
        return <PageLoadingCircle/>
      case "end":
       return children
      case "initialLoading":
        return <InitialLoading/>
      }
  }

    return (
      <AuthContext.Provider value={{
        state: state,
        setState: setState,
        login: login,
        logout: logout,
        sessionForbidden: sessionForbidden
      }}>
        <SwitchRender/>      
      </AuthContext.Provider>

    )
  }

