// const jsonDiff = require("json-diff");
const _ = require("lodash");

// const getJsonDiff = ({ existingSnapshot, currentSnapshot }) => {
//   const changes = jsonDiff.diff(existingSnapshot, currentSnapshot);
//   return changes;
// };
// eslint-disable-next-line prefer-destructuring
const diff = require("deep-diff").diff;

function convertDiffArrayToObject(diffArray) {
  // eslint-disable-next-line prefer-const
  let result = {};

  diffArray.forEach(item => {
    let current = result;

    // Ensure `path` exists before traversing
    if (!item.path) return;

    // eslint-disable-next-line complexity
    item.path.forEach((key, index) => {
      if (index === item.path.length - 1) {
        if (item.kind === "E") {
          // Edit: Store old and new values
          current[key] = { old: item.lhs, new: item.rhs };
        } else if (item.kind === "D") {
          // Deletion: Store only the old value
          current[key] = { old: item.lhs, new: "NOT_AVAILABLE" };
        } else if (item.kind === "N") {
          // New Addition: Store only the new value
          current[key] = { old: "NOT_AVAILABLE", new: item.rhs };
        } else if (item.kind === "A" && item.item.kind === "D") {
          // Array Deletion: Store old value as deleted
          if (!current[key]) current[key] = [];
          current[key].push({
            index: item.index,
            old: item.item.lhs,
            new: "NOT_AVAILABLE"
          });
        }
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    });
  });

  return result;
}

const getJsonDiff = ({ existingSnapshot, currentSnapshot }) => {
  const diffArray = diff(existingSnapshot, currentSnapshot);
  return diffArray ? convertDiffArrayToObject(diffArray) : {};
};

module.exports = getJsonDiff;

const getChangeType = ({ existingSnapshot, currentSnapshot }) => {
  if (_.isEmpty(existingSnapshot)) return "CREATE";

  if (_.isEmpty(currentSnapshot)) return "DELETE";

  return "UPDATE";
};

const trasformInputForAuditLog = ({
  existingSnapshot,
  currentSnapshot,
  entity_type,
  entity_id,
  outlet_id,
  domain,
  userResponse
}) => {
  const changes = getJsonDiff({ existingSnapshot, currentSnapshot });

  const change_type = getChangeType({ existingSnapshot, currentSnapshot });
  const {
    updated_by,
    updated_at,
    is_updated_by_system,
    channel,
    api_url,
    change_mode
  } = currentSnapshot;

  let source_updated_by;
  if (userResponse) {
    const { name, phone_number } = userResponse;
    source_updated_by = `${name}_${phone_number}`;
  }

  return {
    domain,
    entity_id,
    entity_type,
    source_updated_at: updated_at,
    source_updated_by: source_updated_by || updated_by,
    is_updated_by_system,
    changes,
    channel,
    api_url,
    change_mode,
    change_type,
    outlet_id,
    created_by: "audit-system"
  };
};

const transformInputForEntitySnapshot = ({
  currentSnapshot,
  entity_type,
  entity_id,
  domain
}) => {
  return {
    entity_type,
    entity_id,
    domain,
    snapshot: currentSnapshot,
    outlet_id: currentSnapshot?.outlet_id,
    created_by: "audit-system"
  };
};

module.exports = { trasformInputForAuditLog, transformInputForEntitySnapshot };
