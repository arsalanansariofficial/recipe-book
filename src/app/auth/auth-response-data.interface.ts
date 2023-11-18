export interface AuthResponseData {
  kind: string;
  email: string;
  idToken: string;
  localId: string;
  expiresIn: string;
  refreshToken: string;
  registered?: boolean;
}
