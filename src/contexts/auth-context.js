
const initialState = {
  user: {},
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  status: STATUS.PENDING
}

const AuthContext = React.createContext({
  ...initialState,
  login: (user= {}, token ="", expiresAt= "") => {},
  logout: () => {},
  updateUser: () => {},
  setAuthenticationStatus: () => {}
})

const authReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        user: action.payload.user,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        isAuthenticated: true,
        verifyingToken: false,
        status: STATUS.SUCCEEDED
      }
      break;
    
    case "logout":
      return {
        ...initialState,
        status: STATUS.IDLE
      }
      break;
  
    case "updateUser":
      return {
        ...state,
        user: action.payload.user
      }
      break;
  
    case "status":
      return {
        ...state,
        status: action.payload.status
      }
      break;
  
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}