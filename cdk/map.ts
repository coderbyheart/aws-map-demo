import { MapApp } from "./MapApp.js";

const stackName = process.env.STACK_NAME ?? "aws-map-demo";

new MapApp(stackName);
