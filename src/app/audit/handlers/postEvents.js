const postEventsService = require("../services/postEvents");

function postEventsHandler(fastify) {
  const postEvents = postEventsService(fastify);

  return async (request, reply) => {
    const { logTrace, body } = request;

    const entity_type = request.body.message?.attributes?.entity_type;
    const user_id = request.body.message?.attributes?.user_id;

    const { payload } = fastify.parseEvent({ event: body, logTrace });

    const response = await postEvents({
      body: payload,
      entity_type,
      user_id,
      logTrace
    });
    return reply.code(200).send(response);
  };
}

module.exports = postEventsHandler;
