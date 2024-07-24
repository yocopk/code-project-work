import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { ControllerUsers } from "./controllers/Users";
let controllerUsers = new ControllerUsers();
const secretKey = process.env.JWT_SECRET;

dotenv.config();

// Middleware di autenticazione
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  // Logica per verificare il token
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
};

export const generateToken = (user: {
  id: string;
  username: string;
  role: string;
}) => {
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    secretKey,
    {
      expiresIn: "1h",
    }
  );
};

const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user && user.role === role) {
      next();
    } else {
      res.status(403).send("Unauthorized");
    }
  };
};
export { authenticate, errorHandler, authorizeRole };
