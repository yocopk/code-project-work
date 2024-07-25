import { ModelUser } from "../models/User";
import bcrypt from 'bcrypt';
import pool from "../middlewares/db";
import { authenticate, errorHandler, authorizeRole } from "../middlewares/auth";
import dotenv from "dotenv"
import jwt, { Secret } from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET;
 
export class ControllerUsers {
    private saltRounds = 10;

    
 generateToken = (user: {
    id: string;
    username: string;
    role: string;
  }) => {

    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined");
    }
    jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secretKey,
      {
        expiresIn: "1h",
      }
    );
  };

    async register(email: string, password: string): Promise<boolean> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userCheck.rows.length > 0) {
                console.log('Utente già registrato.');
                return false;
            }

            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            const newUser = new ModelUser(email, email, hashedPassword);

            await client.query(
                'INSERT INTO users(id, username, email, password, role) VALUES($1, $2, $3, $4, $5)',
                [newUser.primaryKey, newUser.username, newUser.email, newUser.password, newUser.role]
            );

            await client.query('COMMIT');
            return true;
        } catch (e) {
            await client.query('ROLLBACK');
            console.error('Errore durante la registrazione:', e);
            return false;
        } finally {
            client.release();
        }
    }

    async registerAdmin(email: string, password: string): Promise<boolean> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const adminCheck = await client.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
            if (adminCheck.rows.length > 0) {
                console.log('Admin già registrato.');
                return false;
            }

            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            const newAdmin = new ModelUser(email, email, hashedPassword);
            newAdmin.role = "admin";

            await client.query(
                'INSERT INTO users(id, username, email, password, role) VALUES($1, $2, $3, $4, $5)',
                [newAdmin.primaryKey, newAdmin.username, newAdmin.email, newAdmin.password, newAdmin.role]
            );

            await client.query('COMMIT');
            return true;
        } catch (e) {
            await client.query('ROLLBACK');
            console.error('Errore durante la registrazione admin:', e);
            return false;
        } finally {
            client.release();
        }
    }

    async login(email: string, password: string): Promise<ModelUser | null> {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = generateToken(user);
                    return new ModelUser(user.username, user.email, token);  // Non restituiamo la password
                }
            }
            return null;
        } catch (e) {
            console.error('Errore durante il login:', e);
            return null;
        } finally {
            client.release();
        }
    }

    async logout(token: string): Promise<boolean> {
        // implementazione logout jwt
        return true
    }
}