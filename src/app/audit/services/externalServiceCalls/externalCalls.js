const {
  getAuthToken
} = require("@kovai-pazhamudir-nilayam/kpn-platform-token");

function externalCalls(fastify) {
  async function fetchUserCall({ user_id, logTrace }) {
    try {
      const authToken = await getAuthToken("PLATFORM");
      const response = await fastify.request({
        url: `${fastify.config.CORE_USER_URI}/v2/iam/users/${user_id}`,
        method: "GET",
        headers: {
          ...logTrace,
          Authorization: authToken
        },
        path: `${fastify.config.CORE_USER_URI}/v1/payment-intents`,
        downstream_system: "user-service",
        source_system: "core-audit-service",
        domain: "user-fetch",
        functionality: "fetch user by id"
      });
      return response;
    } catch (error) {
      fastify.log.error(`Failed to fetch user data`);
      return null;
    }
  }
  return {
    fetchUserCall
  };
}

module.exports = externalCalls;
