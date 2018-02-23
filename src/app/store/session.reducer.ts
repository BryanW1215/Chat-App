import { actions } from '../services/session.service';

const INITIAL_STATE: any = {isLoggedIn: false, user: null};

export function sessionReducer(state: any = INITIAL_STATE, action:any): any {
  switch (action.type) {
    case actions.login:
      return {isLoggedIn: true, user: action.payload};

    case actions.logout:
      return {isLoggedIn: false, user: null};

    default:
      return state;
  }
}
