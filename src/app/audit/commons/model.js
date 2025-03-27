const ENTITY_SNAPSHOT = {
  NAME: "entity_snapshot",
  COLUMNS: {
    ENTITY_SNAPSHOT_ID: "entity_snapshot_id",
    ENTITY_TYPE: "entity_type",
    ENTITY_ID: "entity_id",
    SNAPSHOT: "snapshot",
    SOURCE_UPDATED_AT: "source_updated_at",
    SOURCE_UPDATED_BY: "source_updated_by",
    DOMAIN: "domain",
    OUTLET_ID: "outlet_id"
  }
};

const AUDIT_LOGS = {
  NAME: "audit_logs",
  COLUMNS: {
    AUDIT_LOGS_ID: "audit_log_id",
    DOMAIN: "domain",
    ENTITY_TYPE: "entity_type",
    ENTITY_ID: "entity_id",
    SOURCE_UPDATED_AT: "source_updated_at",
    SOURCE_UPDATED_BY: "source_updated_by",
    IS_UPDATED_BY_SYSTEM: "is_updated_by_system",
    CHANGES: "changes",
    OUTLET_ID: "outlet_id"
  }
};

const ENTITY_TYPE_ENTITY_ID_MAPPING = {
  NAME: "entity_type_entity_id_mapping",
  COLUMNS: {
    ID: "id",
    DOMAIN: "domain",
    ENTITY_TYPE: "entity_type",
    ENTITY_ID: "entity_id"
  }
};

module.exports = {
  ENTITY_SNAPSHOT,
  AUDIT_LOGS,
  ENTITY_TYPE_ENTITY_ID_MAPPING
};
