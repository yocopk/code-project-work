import "dotenv/config"
import jwt from "jsonwebtoken";

export const generateToken =(user: {
    id: string;
    username: string;
    role: string;
  }) => {
const secretKey = process.env.JWT_SECRET;

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