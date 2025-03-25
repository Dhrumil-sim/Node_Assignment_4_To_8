import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import songRouter from "./routes/song.routes.js";
import { errorHandler } from "./middlewares/errorHandler/errorHandler.js";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import { verifyJWT } from "./middlewares/authHandler/auth.middleware.js";

interface reqObject extends Request{
    user?: {
        id : string,
        username: string,
        role: string,
    }
}

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);
class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
        this.setErrorHandler();
    }

    private setMiddlewares(): void {
        this.app.use(express.json({ limit: "16kb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "16kb" }));
        this.app.use(cors({ origin: process.env.CORS_ORIGIN }));
        this.app.set('view engine','ejs');
        this.app.use(express.static(path.join(__dirName,'../public')));
        
        this.app.use(cookieParser());
    }

    private setRoutes(): void {
        this.app.use("/api/user", userRouter);
        this.app.use("/api/song",songRouter);
        this.app.get('/',(req: Request,res: Response)=>{
           res.render('index', {error: null});
        })
        this.app.get('/login',(req : Request,res: Response)=>{
             res.render('login',{error: null});
        });
        this.app.get('/logout',(req : Request,res: Response)=>{
            const options = {
                hostname: 'localhost',  // Replace with the hostname of your API
                port: 3000,  // Replace with the port your API is running on
                path: '/api/user/logout',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.cookies.token}`,  // Assuming the token is in a cookie
                },
       }});
       


        this.app.get('/artist/:artistName', verifyJWT, (req: reqObject, res: Response) => {
            const { artistName } = req.params;
             const isValidRoute =  (req.user?.username===artistName);
             if(isValidRoute)
             {
                 return res.render(`artist`,{error: null, user: req.user});
             }else{
                return res.status(403).render('error', { message: 'Access denied. You can only view your own artist page.' });
             }
        });
    }

    private setErrorHandler(): void {
        this.app.use(errorHandler);
    }

    public getServer(): Application {
        return this.app;
    }
}

export default new App().getServer();
