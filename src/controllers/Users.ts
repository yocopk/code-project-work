import { ModelUser } from "../models/User";

export class ControllerUsers {
    private users: ModelUser[] = [];
    private adminWhitelist: ModelUser[] = [];
    
    register(email: string, password: string){
        const userFound = this.users.find((user) => {
            return user.email === email;
          });

        if (userFound) return console.log('Utente già registrato.');
        else {
            const newUser = new ModelUser(email, email, password);
            this.users = [...this.users, newUser];
            return true;
        }
    }

    registerAdmin(email: string, password: string){
        const adminFound = this.adminWhitelist.find((admin) => {
            return admin.email === email;
        })

        if (adminFound) return console.log('Admin già registrato.');
        else {
            const newAdmin = new ModelUser(email, email, password);
            newAdmin.isAdmin = true;
            this.adminWhitelist = [...this.adminWhitelist, newAdmin];
            return true;
        }
    }
}