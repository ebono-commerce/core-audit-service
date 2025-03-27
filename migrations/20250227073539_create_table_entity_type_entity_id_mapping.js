exports.up = knex => {
  return knex.schema.hasTable("entity_type_entity_id_mapping").then(exists => {
    if (!exists) {
      return knex.schema.createTable("entity_type_entity_id_mapping", table => {
        table.uuid("id").primary().notNullable();
        table.string("domain");
        table.string("entity_type");
        table.string("entity_id");
      });
    }
    return false;
  });
};

exports.down = knex => {
  return knex.schema.dropTable("entity_type_entity_id_mapping");
};
