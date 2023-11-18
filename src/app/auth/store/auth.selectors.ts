import { AppState } from 'src/app/store/app.reducer';

export function selectAuth(state: AppState) {
  return state.auth;
}
