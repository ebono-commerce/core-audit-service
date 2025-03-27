const fp = require("fastify-plugin");
const { Parser } = require("@json2csv/plainjs");
const { Buffer } = require("node:buffer");
const FormData = require("form-data");
const {
  getAuthToken
} = require("@ebono-commerce/ebono-platform-token");

const DEFAULT_PARSER_OPTIONS = {
  fields: [
    { label: "Department", value: "department_category_name" },
  ]
};

const artifactServicePlugin = async fastify => {
  async function convertJSONToCsvFileAndUploadToArtifact({
    logTrace,
    inputData,
    csv_file_name,
    csv_parser_options = DEFAULT_PARSER_OPTIONS
  }) {
    const csvParser = new Parser(csv_parser_options);
    const filename = `${csv_file_name}.csv`;
    const csvData = csvParser.parse(inputData);
    const file = Buffer.from(csvData);

    const createArtifactInput = new FormData();

    createArtifactInput.append("file", file, filename);

    const authToken = await getAuthToken("PLATFORM");

    const url = `${fastify.config.CORE_ARTIFACT_SERVICE_URI}/v1/media/upload?artifact_config_id=${fastify.config.CORE_ARTIFACT_CONFIG_ID}`;

    const boundary = createArtifactInput.getBoundary();

    const result = await fastify.request({
      url,
      method: "POST",
      body: createArtifactInput,
      headers: {
        Authorization: authToken,
        ...logTrace
      },
      downstream_system: "core-artifact",
      path: "/v1/media/upload/:artifact_config_id",
      functionality: "Upload Price Report File",
      source_system: "core-price-processor",
      domain: "Price",
      contentType: `multipart/form-data;boundary=${boundary}`
    });
    return {
      media_url: result.media_url,
      download_media_url: result.download_media_url
    };
  }

  fastify.decorate(
    "convertJSONToCsvFileAndUploadToArtifact",
    convertJSONToCsvFileAndUploadToArtifact
  );
};

module.exports = fp(artifactServicePlugin);
