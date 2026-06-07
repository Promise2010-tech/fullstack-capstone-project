const config = {
  // If the .env file fails to load, it will use port 3060 automatically
  backendUrl: process.env.REACT_APP_BACKEND_URL || "http://localhost:3060",
};

console.log(`backendUrl in config.js: ${config.backendUrl}`);
export { config as urlConfig };