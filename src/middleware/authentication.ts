import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "chave_padrao";

declare global {
    namespace Express {
        interface Request {
            userID: string;
        }
    }
}

const authenticationVerify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const sessionToken = req.cookies.session_id || req.headers.authorization?.split(" ")[1];

    if (sessionToken) {
        try {
            const decoded = jwt.verify(sessionToken, SECRET_KEY);
            if (typeof decoded === 'object' && 'userID' in decoded) {
                req.userID = decoded.userID;
                next();
            }
        } catch (error: any) {
            const errorMessage = error.name === "TokenExpiredError" ? "Token JWT expirado!" : "Token JWT inválido!";
            res.status(403).json({ data: null, error: errorMessage });
            return;
        }
    } else {
        res.status(401).json({ data: null, error: "Token JWT Ausente!" });
    }
};

export default authenticationVerify;
