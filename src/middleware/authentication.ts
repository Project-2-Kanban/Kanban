import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "chave_padrao";

export default async (req: Request, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies.session_id || req.headers.authorization?.split(" ")[1];

    if (!sessionToken) {
        return res.status(401).json({ data: null, error: "Token JWT Ausente!" });
    }

    try {
        
        await jwt.verify(sessionToken, SECRET_KEY) as JwtPayload;
        next();
    } catch (error: any) {
       
        const errorMessage = error.name === "TokenExpiredError" ? "Token JWT expirado!" : "Token JWT inválido!";
        return res.status(403).json({ data: null, error: errorMessage });
    }
};