import { ModelAuth } from "../models/Auth";
import { ModelUser } from "../models/User";

export class ControllerAuths {
    private auths: ModelAuth[] = [];
    private users: ModelUser[] = [];

    checkToken(token: string) {
        const authFound = this.auths.find((auth) => auth.token === token);
        return authFound || false;
    }

    login(email: string, password: string) {
        const userFound = this.users.find((user) => {
            return user.email === email && user.password === password;
        })
        const alreadyLogged = this.auths.find((auth) => {
            return auth.referenceKeyUser === userFound?.primaryKey;
          });
      
          if (alreadyLogged) {
            console.log("Utente già loggato.");
            return null;
          }

        if (!userFound){
            console.log('Credenziali non valide');
        } else {
            const newAuth = new ModelAuth(userFound.primaryKey);
            this.auths = [...this.auths, newAuth];
            return newAuth;
        }
    }

    logout(token: string) {
        const authFound = this.checkToken(token);
        if (authFound) {
        this.auths = this.auths.filter((auth) => auth.token !== token);
        console.log("Logout effettuato con successo!");
        } else {
            console.log("Token non valido");
            return null;
        }
    }
}