import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 requisições por IP/minuto
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: "Muitas requisições. Tente novamente mais tarde." });
  },
});
