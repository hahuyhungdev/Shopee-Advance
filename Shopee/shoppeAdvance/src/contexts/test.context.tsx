import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ExtendedPurchase } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchase[]
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
  reset: () => void
}

export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null
})

const initialAppContext = getInitialAppContext()

export const AppContext = createContext<AppContextInterface | null>(null)

export const AppProvider = ({
  children,
  defaultValue = initialAppContext,
  props
}: {
  children: React.ReactNode
  defaultValue?: AppContextInterface
  props?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultValue.isAuthenticated)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>(defaultValue.extendedPurchases)
  const [profile, setProfile] = useState<User | null>(defaultValue.profile)

  const reset = useCallback(() => {
    setIsAuthenticated(false)
    setExtendedPurchases([])
    setProfile(null)
  }, [])

  const contextValue = useMemo<AppContextInterface>(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      profile,
      setProfile,
      extendedPurchases,
      setExtendedPurchases,
      reset
    }),
    [isAuthenticated, setIsAuthenticated, profile, setProfile, extendedPurchases, setExtendedPurchases, reset]
  )

  return (
    <AppContext.Provider value={contextValue}>
      <div {...props}>{children}</div>
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
