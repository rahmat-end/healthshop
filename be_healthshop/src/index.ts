import * as express from "express"
import * as cors from "cors"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import router from "./route"

AppDataSource.initialize().then(async () => {
    const app = express()
    const port = 5000

    //setup CORS
    const corsOption = {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
    }
    app.use(cors(corsOption))
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use("/api/v1", router)
    app.get("/", (req: Request, res: Response) => {
        res.send("Ping")
    })
    app.listen(port, () => {
        console.log("Server running on port 5000")
    })

}).catch(error => console.log(error))