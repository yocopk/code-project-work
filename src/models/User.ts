import { v4 as uuidv4 } from 'uuid';

export class ModelUser { 
    primaryKey: string
    username: string
    email: string
    password: string
    role: string
    constructor(username: string, email: string, password: string) {
        this.primaryKey = uuidv4();
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = "user";
    }
}