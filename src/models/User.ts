export class ModelUser {
  primaryKey: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  constructor(username: string, email: string, password: string) {
    this.primaryKey = Math.random().toString(36).slice(2);
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
  }
}
