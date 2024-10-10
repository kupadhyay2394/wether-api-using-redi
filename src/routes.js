import { Router } from "express";
import {getWeather} from "./controller.js";


const router=Router();
router.route("/getWether/:CITY").get(getWeather);

export default router;
