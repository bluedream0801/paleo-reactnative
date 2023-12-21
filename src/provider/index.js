import React from 'react'

const defaultInitialState = {
  productsRoutes: [],
}

const AppContext = React.createContext(defaultInitialState)

export default AppContext
