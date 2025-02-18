import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from './logger';
import client from 'prom-client';
import { 
  intToRoman,
  romanToInt,
  intToRomanLimitless,
  romanToIntLimitless
} from './romanConverter';

interface QueryParams {
  query: string;
}

const app = express();
const port = process.env.PORT || 8080;
// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());

// Create a Registry and set default labels.
const register = new client.Registry();
register.setDefaultLabels({ app: 'roman-service' });
// Collect default metrics (e.g., memory usage, CPU, etc.)
client.collectDefaultMetrics({ register });

// metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Log every incoming request
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming ${req.method} request for ${req.url}`);
  next();
});

// romannumeral endpoint: convert int-> Roman numeral
app.get<{}, any, any, QueryParams>(
  '/romannumeral',
  (req: Request<{}, any, any, QueryParams>, res: Response, next: NextFunction): void => {
    const { query } = req.query;
    logger.info(`Processing /romannumeral with query: ${query}`);
    if (!query) {
      const msg = "Query parameter 'query' is required.";
      logger.error(msg);
      res.status(400).send(msg);
      return;
    }
    const inputNumber = parseInt(query, 10); // base-10
    if (isNaN(inputNumber)) {
      const msg = "Query parameter must be a valid integer.";
      logger.error(msg);
      res.status(400).send(msg);
      return;
    }
    try {
      const romanNumeral = intToRoman(inputNumber);
      logger.info(`Converted ${inputNumber} to Roman numeral: ${romanNumeral}`);
      res.json({ input: query, output: romanNumeral });
    } catch (error: any) {
      logger.error(error.message);
      res.status(400).send(error.message);
    }
  }
);

// romannumeralreverse endpoint: convert Roman numeral-> int
app.get<{}, any, any, QueryParams>(
  '/romannumeralreverse',
  (req: Request<{}, any, any, QueryParams>, res: Response, next: NextFunction): void => {
    const { query } = req.query;
    logger.info(`Processing /romannumeralreverse with query: ${query}`);
    if (!query) {
      const msg = "Query parameter 'query' is required.";
      logger.error(msg);
      res.status(400).send(msg);
      return;
    }
    try {
      const number = romanToInt(query);
      if (number <= 0 || number > 3999) {
        throw new Error("Input must represent a number between I and MMMCMXCIX (1-3999).");
      }
      logger.info(`Converted ${query} to number: ${number}`);
      res.json({ input: query, output: number.toString() });
    } catch (error: any) {
      logger.error(error.message);
      res.status(400).send(error.message);
    }
  }
);

// romannumerallimitless endpoint: convert int-> Roman numeral
app.get<{}, any, any, QueryParams>(
  '/romannumerallimitless',
  (req: Request<{}, any, any, QueryParams>, res: Response, next: NextFunction): void => {
    const { query } = req.query;
    logger.info(`Processing /romannumerallimitless with query: ${query}`);
    if (!query) {
      const msg = "Query parameter 'query' is required.";
      logger.error(msg);
      res.status(400).send(msg);
      return;
    }
    const inputNumber = parseInt(query, 10);
    if (isNaN(inputNumber)) {
      const msg = "Query parameter must be a valid integer.";
      logger.error(msg);
      res.status(400).send(msg);
      return;
    }
    try {
      const romanNumeral = intToRomanLimitless(inputNumber);
      logger.info(`Converted ${inputNumber} to limitless Roman numeral: ${romanNumeral}`);
      res.json({ input: query, output: romanNumeral });
    } catch (error: any) {
      logger.error(error.message);
      res.status(400).send(error.message);
    }
  }
);

// romannumeralreverselimitless endpoint: convert Roman numeral-> int
app.get<{}, any, any, QueryParams>(
  '/romannumeralreverselimitless',
  (req: Request<{}, any, any, QueryParams>, res: Response, next: NextFunction): void => {
    const { query } = req.query;
    logger.info(`Processing /romannumeralreverselimitless with query: ${query}`);
    if (!query) {
      const msg = "Query parameter 'query' is required.";
      logger.error(msg);
      res.status(400).send(msg);
      return;
    }
    try {
      const number = romanToIntLimitless(query);
      logger.info(`Converted limitless Roman numeral ${query} to number: ${number}`);
      res.json({ input: query, output: number.toString() });
    } catch (error: any) {
      logger.error(error.message);
      res.status(400).send(error.message);
    }
  }
);

// health endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

let server: any;

if (require.main === module) {
  server = app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
  });
  const shutdown = () => {
    logger.info("Shutting down server...");
    server.close(() => {
      logger.info("Server closed.");
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

export default app;