const { v5: uuidV5 } = require("uuid");
const entityTypeEntityIdMappingRepo = require("../repository/entity_type_entity_id_mapping");

const { SUCCESS_RESPONSE } = require("../commons/constants");

function postEntityMappingService(fastify) {
  const { createEntityTypeEntityIdMapping } =
    entityTypeEntityIdMappingRepo(fastify);
  return async ({ body, logTrace }) => {
    const transformedInput = body.map(item => {
      const { entity_type, entity_id, domain } = item;

      const id = uuidV5(`${entity_type}_${entity_id}_${domain}`, uuidV5.URL);

      return {
        id,
        entity_id,
        entity_type,
        domain
      };
    });

    await createEntityTypeEntityIdMapping.call(fastify.knex, {
      data: transformedInput,
      logTrace
    });
    return SUCCESS_RESPONSE;
  };
}
module.exports = postEntityMappingService;
