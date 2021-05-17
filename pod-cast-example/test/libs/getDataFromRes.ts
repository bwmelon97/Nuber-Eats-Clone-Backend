import * as request from 'supertest';

export const getDataFromRes = (res: request.Response, key: string) => res.body.data[key]