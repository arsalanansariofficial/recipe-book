export class User {
  constructor(
    public id: string,
    public email: string,
    public _token: string,
    public _tokenExpirationDate: Date
  ) {}

  public get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return null;
    else return this._token;
  }
}
