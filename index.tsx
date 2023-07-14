import { render } from "preact";
import { App } from "./App";

console.debug("BUILD_TIME", import.meta.env.PUBLIC_BUILD_TIME);
console.debug("MAP_NAME", import.meta.env.PUBLIC_MAP_NAME);
console.debug("MAP_API_KEY", import.meta.env.PUBLIC_MAP_API_KEY);
console.debug("PLACES_INDEX_NAME", import.meta.env.PUBLIC_PLACES_INDEX_NAME);
console.debug("AWS_REGION", import.meta.env.PUBLIC_AWS_REGION);

const container = document.getElementById("root") as HTMLElement;
render(<App />, container);
