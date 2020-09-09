import { createContext } from 'react';

export const UserAuthedContext:any = createContext(false)
export const UsersContext:any = createContext([]);
export const DailyFoodContext:any = createContext([]);
export const UsersSettingsContext:any = createContext({});
export const IsLoggedContext:any = createContext(false);
export const CreatingNewUserContext:any = createContext(false);
export const LoggedInUserSettingsContext: any = createContext({});
export const LoggedInIDContext:any = createContext("");