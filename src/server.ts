import app from "./app";
import { log } from "./config/log_config";

const port = process.env.PORT || 8080;

app.listen(port, () => {
  log.info(`Server started at http://localhost:${port}`);
});