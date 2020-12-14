import { createContext } from 'react';

export const UserAuthedContext:any = createContext(false)
export const UsersContext:any = createContext([]);
export const DailyFoodContext:any = createContext([]);
export const UsersSettingsContext:any = createContext({});
export const LoggedInUserSettingsContext: any = createContext({});
export const LoggedInIDContext:any = createContext("");
export const NavigatedFromTrackerContext:any = createContext(false)
export const SignedOutContext:any = createContext(false)
export const NavigatedFromLoginContext:any = createContext(false);