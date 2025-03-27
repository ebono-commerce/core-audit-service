const entitySnapshotRepo = require("../repository/entity_snapshot");
const entityTypeEntityIdMappingRepo = require("../repository/entity_type_entity_id_mapping");
const auditLogsRepo = require("../repository/audit_logs");
const { ENTITY_SNAPSHOT } = require("../commons/model");
const { SUCCESS_RESPONSE } = require("../commons/constants");
const {
  transformInputForEntitySnapshot,
  trasformInputForAuditLog
} = require("../transformers/postEvents");

const externalCalls = require("./externalServiceCalls/externalCalls");

function postEventsService(fastify) {
  const { createEntitySnapshot, getEntitySnapshot, updateEntitySnapshot } =
    entitySnapshotRepo(fastify);
  const { getEntityTypeEntityIdMappingByEntityType } =
    entityTypeEntityIdMappingRepo(fastify);

  const { createAudityLog } = auditLogsRepo(fastify);
  const { fetchUserCall } = externalCalls(fastify);
  // eslint-disable-next-line complexity
  return async ({ body, entity_type, user_id, logTrace }) => {
    const currentSnapshot = Array.isArray(body) ? body : [body];

    const { entity_id: CONFIGURED_ENTITY_ID, domain } =
      await getEntityTypeEntityIdMappingByEntityType.call(fastify.knex, {
        entity_type,
        logTrace
      });

    // return true if there is no valid entity_type
    if (!CONFIGURED_ENTITY_ID) {
      return SUCCESS_RESPONSE;
    }

    const userResponse = await fetchUserCall({
      user_id,
      logTrace
    });

    const knexTrx = await fastify.knex.transaction();

    try {
      // eslint-disable-next-line no-shadow
      const operations = currentSnapshot.map(async currentSnapshot => {
        const entity_id = currentSnapshot[CONFIGURED_ENTITY_ID];

        const existingSnapshot = await getEntitySnapshot.call(fastify.knex, {
          input: {
            filters: {
              whereFields: {
                [ENTITY_SNAPSHOT.COLUMNS.ENTITY_ID]: entity_id,
                [ENTITY_SNAPSHOT.COLUMNS.ENTITY_TYPE]: entity_type,
                ...(currentSnapshot.outlet_id && {
                  [ENTITY_SNAPSHOT.COLUMNS.OUTLET_ID]: currentSnapshot.outlet_id
                })
              }
            }
          },
          logTrace
        });

        const inputForAuditLog = trasformInputForAuditLog({
          existingSnapshot: existingSnapshot?.snapshot || {},
          currentSnapshot,
          entity_type,
          entity_id,
          outlet_id: currentSnapshot.outlet_id,
          domain,
          userResponse
        });

        const inputForEntitySnapshot = transformInputForEntitySnapshot({
          currentSnapshot,
          entity_type,
          entity_id,
          domain
        });

        if (!existingSnapshot) {
          return Promise.all([
            createEntitySnapshot.call(knexTrx, {
              data: inputForEntitySnapshot,
              logTrace
            }),
            createAudityLog.call(knexTrx, {
              data: inputForAuditLog,
              logTrace
            })
          ]);
        }

        return Promise.all([
          updateEntitySnapshot.call(knexTrx, {
            input: {
              data: inputForEntitySnapshot,
              filters: {
                whereFields: {
                  [ENTITY_SNAPSHOT.COLUMNS.ENTITY_ID]: entity_id,
                  [ENTITY_SNAPSHOT.COLUMNS.ENTITY_TYPE]: entity_type,
                  ...(currentSnapshot.outlet_id && {
                    [ENTITY_SNAPSHOT.COLUMNS.OUTLET_ID]:
                      currentSnapshot.outlet_id
                  })
                }
              }
            }
          }),

          createAudityLog.call(knexTrx, {
            data: inputForAuditLog,
            logTrace
          })
        ]);
      });

      await Promise.all(operations);
      await knexTrx.commit();
      return SUCCESS_RESPONSE;
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postEventsService;
