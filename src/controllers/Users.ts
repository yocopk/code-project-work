import { Request, Response } from "express";
import { ModelUser } from "../models/User";
import bcrypt from 'bcrypt';
import pool from "../config/db";
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
    const result = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secretKey,
      {
        expiresIn: "1h",
      }
    );
    return result;
  };

    async register(req: Request, res: Response) {
        const client = await pool.connect();
        const { email, password } = req.body;
        console.log(req.body)
        try {
            await client.query('BEGIN');
            
            const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userCheck.rows.length > 0) {
                return res.status(400).send({ message: "Utente esistente" });
            }

            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            const newUser = new ModelUser(email, email, hashedPassword);

            await client.query(
                'INSERT INTO users(id, username, email, password, role) VALUES($1, $2, $3, $4, $5)',
                [newUser.primaryKey, newUser.username, newUser.email, newUser.password, newUser.role]
            );

            await client.query('COMMIT');
            return res.status(200).send({ message: "Utente registrato con successo" });
        } catch (e) {
            await client.query('ROLLBACK');
            return res.status(400).send({ message: "Errore durante la registrazione." });
        } finally {
            client.release();
        }
    }

    async registerAdmin(req: Request, res: Response) {
        const client = await pool.connect();
        const { email, password } = req.body;
        try {
            await client.query('BEGIN');
            
            const adminCheck = await client.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
            if (adminCheck.rows.length > 0) {
                return res.status(400).send("Admin già registrato.");
            }

            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            const newAdmin = new ModelUser(email, email, hashedPassword);
            newAdmin.role = "admin";

            await client.query(
                'INSERT INTO users(id, username, email, password, role) VALUES($1, $2, $3, $4, $5)',
                [newAdmin.primaryKey, newAdmin.username, newAdmin.email, newAdmin.password, newAdmin.role]
            );

            await client.query('COMMIT');
            return res.status(200).send("Admin registrato con successo.");
        } catch (e) {
            await client.query('ROLLBACK');
            return res.status(400).send("Errore durante la registrazione admin.");
        } finally {
            client.release();
        }
    }

    async login(req: Request, res: Response) {
        const client = await pool.connect();
        const { email, password } = req.body;
        try {
            const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = this.generateToken(user);
                    return res.status(200).send(new ModelUser(user.username, user.email, token));  // Non restituiamo la password
                }
            }
            return null;
        } catch (e) {
            return res.status(400).send("Errore durante il login.");
        } finally {
            client.release();
        }
    }

    async logout(token: string, req: Request, res: Response) {
        // implementazione logout jwt
        return res.status(200).send("Logout effettuato con successo");
    }
}