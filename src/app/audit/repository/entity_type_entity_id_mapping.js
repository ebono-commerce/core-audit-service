const { logQuery } = require("../../commons/helpers");
const { ENTITY_TYPE_ENTITY_ID_MAPPING } = require("../commons/model");

function entityTypeEntityIdMapping(fastify) {
  async function createEntityTypeEntityIdMapping({ data, logTrace }) {
    const knex = this;
    const query = knex(ENTITY_TYPE_ENTITY_ID_MAPPING.NAME)
      .insert(data)
      .onConflict([ENTITY_TYPE_ENTITY_ID_MAPPING.COLUMNS.ID])
      .merge();
    logQuery({
      logger: fastify.log,
      query,
      context: "Create entity type entity id mapping",
      logTrace
    });
    return query;
  }

  async function getEntityTypeEntityIdMappings({ logTrace }) {
    const knex = this;
    const query = knex(ENTITY_TYPE_ENTITY_ID_MAPPING.NAME).select("*");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get entity type entity id mapping",
      logTrace
    });
    return query;
  }

  async function getEntityTypeEntityIdMappingByEntityType({
    entity_type,
    logTrace
  }) {
    const knex = this;
    const query = knex(ENTITY_TYPE_ENTITY_ID_MAPPING.NAME)
      .select("*")
      .where({
        [ENTITY_TYPE_ENTITY_ID_MAPPING.COLUMNS.ENTITY_TYPE]: entity_type
      });

    logQuery({
      logger: fastify.log,
      query,
      context: "Get entity type entity id mapping",
      logTrace
    });

    const response = await query;
    return response[0];
  }

  return {
    createEntityTypeEntityIdMapping,
    getEntityTypeEntityIdMappings,
    getEntityTypeEntityIdMappingByEntityType
  };
}

module.exports = entityTypeEntityIdMapping;
