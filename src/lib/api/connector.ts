import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type ConnectorOutcome<Success, Failure = never> = Promise<
  AxiosResponse<Success> | Failure
>;

const defaultClient = axios.create();

function defaultErrorHandler(e: unknown): never {
  if (axios.isAxiosError(e)) {
    console.error("Axios error:", e.message, e.response?.data);
  } else {
    console.error("Unexpected error:", e);
  }
  throw e;
}

function handleConnection<Success, Failure>(
  connect: () => Promise<AxiosResponse<Success>>,
  errorHandler: (e: unknown) => Failure = defaultErrorHandler
): ConnectorOutcome<Success, Failure> {
  return connect().catch(errorHandler);
}

function get<Response>(
  url: string,
  config: AxiosRequestConfig = {},
  client = defaultClient
): ConnectorOutcome<Response> {
  return handleConnection(() => client.get<Response>(url, config));
}

function post<Response, Body>(
  url: string,
  data: Body,
  config: AxiosRequestConfig = {},
  client = defaultClient
): ConnectorOutcome<Response> {
  return handleConnection(() => client.post<Response>(url, data, config));
}

function put<Response, Body>(
  url: string,
  data: Body,
  config: AxiosRequestConfig = {},
  client = defaultClient
): ConnectorOutcome<Response> {
  return handleConnection(() => client.put<Response>(url, data, config));
}

function patch<Response, Body>(
  url: string,
  data: Body,
  config: AxiosRequestConfig = {},
  client = defaultClient
): ConnectorOutcome<Response> {
  return handleConnection(() => client.patch<Response>(url, data, config));
}

function del<Response>(
  url: string,
  config: AxiosRequestConfig = {},
  client = defaultClient
): ConnectorOutcome<Response> {
  return handleConnection(() => client.delete<Response>(url, config));
}

const connector = {
  get,
  post,
  put,
  patch,
  del,
};

export default connector;
