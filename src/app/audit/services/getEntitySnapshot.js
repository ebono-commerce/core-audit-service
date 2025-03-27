const entitySnapshotRepo = require("../repository/entity_snapshot");
const { ENTITY_SNAPSHOT } = require("../commons/model");

function getEntitySnapshotService(fastify) {
  const { getEntitySnapshot } = entitySnapshotRepo(fastify);
  return async ({ query, logTrace }) => {
    const { entity_id, entity_type } = query;
    const response = await getEntitySnapshot.call(fastify.knex, {
      input: {
        filters: {
          whereFields: {
            [ENTITY_SNAPSHOT.COLUMNS.ENTITY_ID]: entity_id,
            [ENTITY_SNAPSHOT.COLUMNS.ENTITY_TYPE]: entity_type
          }
        }
      },
      logTrace
    });
    return response;
  };
}
module.exports = getEntitySnapshotService;
