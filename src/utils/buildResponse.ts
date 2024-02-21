const RESPONSE_STATUS = {
  OK: "ok",
  ERROR: "error",
};

const buildErrorResponse = (message?: string) => {
  console.error(message);
  return {
    status: RESPONSE_STATUS.ERROR,
    message: message || "Something went wrong",
  };
};

const buildSuccessResponse = <T>(response?: T) => {
  return {
    status: RESPONSE_STATUS.OK,
    data: response,
  };
};

export { buildErrorResponse, buildSuccessResponse, RESPONSE_STATUS };
