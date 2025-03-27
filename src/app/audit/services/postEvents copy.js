const entitySnapshotRepo = require("../repository/entity_snapshot");
const entityTypeEntityIdMappingRepo = require("../repository/entity_type_entity_id_mapping");
const auditLogsRepo = require("../repository/audit_logs");
const { ENTITY_SNAPSHOT } = require("../commons/model");
const { SUCCESS_RESPONSE } = require("../commons/constants");
const {
  transformInputForEntitySnapshot,
  trasformInputForAuditLog
} = require("../transformers/postEvents");
const assortmentEvent = require("./postAssortmentEvent");
const priceEvent = require("./priceEvent");

function postEventsService(fastify) {
  const { createEntitySnapshot, getEntitySnapshot, updateEntitySnapshot } =
    entitySnapshotRepo(fastify);
  const { getEntityTypeEntityIdMappingByEntityType } =
    entityTypeEntityIdMappingRepo(fastify);

  const { createAudityLog } = auditLogsRepo(fastify);

  // eslint-disable-next-line complexity
  return async ({ body, entity_type, logTrace }) => {
    const { entity_id: ENTITY_ID, domain } =
      await getEntityTypeEntityIdMappingByEntityType.call(fastify.knex, {
        entity_type,
        logTrace
      });

    if (entity_type === "Product-Assortment") {
      return assortmentEvent({
        fastify,
        logTrace,
        ENTITY_ID,
        entity_type,
        domain,
        body
      });
    }
    if (entity_type === "PRICE_ONLINE") {
      return priceEvent({
        fastify,
        logTrace,
        ENTITY_ID,
        entity_type,
        domain,
        body
      });
    }

    const entity_id = body[ENTITY_ID];
    const existingSnapshot = await getEntitySnapshot.call(fastify.knex, {
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

    const currentSnapshot = body;

    const inputForAuditLog = trasformInputForAuditLog({
      existingSnapshot: existingSnapshot?.snapshot || {},
      currentSnapshot,
      entity_type,
      entity_id,
      domain
    });

    const inputForEntitySnapshot = transformInputForEntitySnapshot({
      currentSnapshot,
      entity_type,
      entity_id,
      domain
    });
    const knexTrx = await fastify.knex.transaction();
    try {
      if (!existingSnapshot) {
        const createEntitySnapshotPromise = createEntitySnapshot.call(knexTrx, {
          data: inputForEntitySnapshot,
          logTrace
        });

        const createAuditLogPromise = createAudityLog.call(knexTrx, {
          data: inputForAuditLog,
          logTrace
        });

        await Promise.all([createEntitySnapshotPromise, createAuditLogPromise]);

        await await knexTrx.commit();

        return SUCCESS_RESPONSE;
      }

      const updateEntitySnapshotPromise = updateEntitySnapshot.call(knexTrx, {
        input: {
          data: inputForEntitySnapshot,
          filters: {
            whereFields: {
              [ENTITY_SNAPSHOT.COLUMNS.ENTITY_ID]: entity_id,
              [ENTITY_SNAPSHOT.COLUMNS.ENTITY_TYPE]: entity_type
            }
          }
        }
      });

      const createAuditLogPromise = createAudityLog.call(knexTrx, {
        data: inputForAuditLog,
        logTrace
      });

      await Promise.all([updateEntitySnapshotPromise, createAuditLogPromise]);

      await knexTrx.commit();
      return SUCCESS_RESPONSE;
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postEventsService;
