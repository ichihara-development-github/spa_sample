import React, { createContext, useState } from "react";

export const ConfigContext = createContext();


export const ConfigProvider = ({children}) => {

  const [params, setParams] = useState();
   
  return (
      <ConfigContext.Provider value={{
          params: params,
          setParams: setParams
      }}>
          {children}
      </ConfigContext.Provider>
  )
}
