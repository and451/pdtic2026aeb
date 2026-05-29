import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import necessidadesRouter from "./necessidades";
import okrsRouter from "./okrs";
import kpisRouter from "./kpis";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(necessidadesRouter);
router.use(okrsRouter);
router.use(kpisRouter);
router.use(dashboardRouter);

export default router;
