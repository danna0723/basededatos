const neo4j = require('neo4j-driver');

let driver = null

const dbConnectionNeo4j = async () => {
  const URI = process.env.NEO4J_URI || 'neo4j+s://d4aee8f1.databases.neo4j.io';
  const USER = process.env.NEO4J_USER || '<Username>';
  const PASSWORD = process.env.NEO4J_PASSWORD || '<Password>';

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log('Neo4j Connected');
    console.log(`Connected to Neo4j Version: ${serverInfo.agent}`);
  } catch (err) {
    console.error(`Neo4j connection error:\n${err}\nCause: ${err.cause}`);
    throw new Error('Error connecting to Neo4j');
  }
};

const getSession = () => {
  if (!driver) {
    throw new Error('Neo4j driver not initialized. Call dbConnectionNeo4j() first.');
  }
  return driver.session();
};

module.exports = {
  dbConnectionNeo4j,
  getSession,
};
