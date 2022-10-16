import pino from "pino";
import * as dotenv from "dotenv";
import shortid from "shortid";
import fetch from "node-fetch";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const CLUSTER_SIZE = parseInt(process.env.CLUSTER_SIZE);
const DATA_UPDATE_FREQUENCY = parseInt(process.env.DATA_UPDATE_FREQUENCY);
const API_URL = process.env.API_URL;

const logger = pino({ level: NODE_ENV === "production" ? "info" : "debug" });

logger.info(`Connecting to ${API_URL}`);
logger.info(`CLUSTER_SIZE: ${CLUSTER_SIZE}`);

let ids = initArrayOfIDs(CLUSTER_SIZE);
let cluster = initCluster(ids);

let tracesPerSecond = 0;

async function putClusterData(nodeName, colorIndex) {
  // Body1646
  // 1, 2, 3
  const URL = `${API_URL}/?node_name=${nodeName}&colorindex=${colorIndex}`;
  try {
    const response = await fetch(URL, {
      method: "PUT",
    });
    if (response.status !== 200) {
      logger.error(
        new Error(`ERROR on ${URL}: ${response.status} ${response.statusText}`)
      );
      return;
    }
  } catch (error) {
    logger.error(error.message);
  }
}

setInterval(() => {
  if (!tracesPerSecond) {
    return;
  }
  logger.info(`Sending ${tracesPerSecond} traces/sec`);
  tracesPerSecond = 0;
}, 1000);

logger.info(`DATA_UPDATE_FREQUENCY: ${DATA_UPDATE_FREQUENCY}`);
setInterval(() => {
  if (!ids.length) {
    return;
  }
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  cluster[randomId] = getRandomColor();
  logger.info(`PUT ${randomId}: ${cluster[randomId]}`);
  putClusterData(randomId, cluster[randomId]);
  ++tracesPerSecond;
}, DATA_UPDATE_FREQUENCY);

let elapsedTime = 0;
let lastTime = new Date();

function progressValue(
  value,
  elapsedTime,
  options = { speed: 0.5, min: 0, max: 100 }
) {
  if (value >= options.max) return value - 40;
  if (value <= options.min) return value + 40;
  const newValue = value + Math.sin(elapsedTime + 3) * options.speed;
  const normalized = Math.abs(newValue);
  return Math.floor(normalized);
}

function getRandomColor() {
  const randomColor = Math.ceil(Math.random() * 3);
  return randomColor;
}

function initArrayOfIDs(size) {
  const ids = new Array(size).fill(null).map((_, idx) => `Body${idx}`);
  return ids;
}

function initCluster(ids) {
  const cluster = {};
  ids.forEach((id) => (cluster[id] = Math.ceil(Math.random() * 3)));
  return cluster;
}
