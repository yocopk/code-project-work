import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
const secretKey = process.env.JWT_SECRET as Secret;

dotenv.config();

// Middleware di autenticazione
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined");
  }
  try { 
    const result =  jwt.verify(token, secretKey)
    req.body.user = result;
  }
  catch(e) {
    return res.status(400).send("Invalid token")
   }  // Logica per verificare il token
  next(); // Passa al prossimo middleware se il token è valido
};

// Middleware per la gestione degli errori
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next()
};


const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined");
    }
    if (user && user.role === role) {
      next();
    } else {
      res.status(403).send("Unauthorized");
    }
  };
};
export { authenticate, errorHandler, authorizeRole };
