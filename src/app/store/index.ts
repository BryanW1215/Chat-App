import { combineReducers } from 'redux';
import { sessionReducer } from './session.reducer';

export class IAppState {
  session?: any;

}
export const rootReducer = combineReducers<IAppState>({
  session: sessionReducer
});
