const { logQuery } = require("../../commons/helpers");
const { ENTITY_SNAPSHOT } = require("../commons/model");

function entitySnapshot(fastify) {
  async function createEntitySnapshot({ data, logTrace }) {
    const knex = this;
    const query = knex(ENTITY_SNAPSHOT.NAME).insert(data);

    logQuery({
      logger: fastify.log,
      query,
      context: "Create entity snapshot",
      logTrace
    });
    return query;
  }

  async function getEntitySnapshot({ input, logTrace }) {
    const knex = this;
    const { filters } = input;

    const { whereFields } = filters;
    let query = knex(ENTITY_SNAPSHOT.NAME).select("*");

    if (whereFields) {
      query = query.where(whereFields);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get entity snapshot",
      logTrace
    });
    const response = await query;

    return response[0];
  }

  async function updateEntitySnapshot({ input, logTrace }) {
    const knex = this;
    const { filters, data } = input;

    const { whereFields } = filters;
    const query = knex(ENTITY_SNAPSHOT.NAME).update(data).where(whereFields);

    logQuery({
      logger: fastify.log,
      query,
      context: "Update entity snapshot",
      logTrace
    });
    return query;
  }
  return {
    createEntitySnapshot,
    getEntitySnapshot,
    updateEntitySnapshot
  };
}

module.exports = entitySnapshot;
