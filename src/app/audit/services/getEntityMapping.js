const entityTypeEntityIdMappingRepo = require("../repository/entity_type_entity_id_mapping");

function getEntityMappingService(fastify) {
  const { getEntityTypeEntityIdMappings } =
    entityTypeEntityIdMappingRepo(fastify);
  return async ({ logTrace }) => {
    const response = await getEntityTypeEntityIdMappings.call(fastify.knex, {
      logTrace
    });
    return response;
  };
}
module.exports = getEntityMappingService;
