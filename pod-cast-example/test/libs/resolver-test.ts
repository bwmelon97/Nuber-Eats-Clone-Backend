import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GRAPHQL_ENDPOINT } from 'test/test.constants';


const baseTest = (app: INestApplication) => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT)
export const publicTest = (
    app: INestApplication,
    query: string
) => baseTest(app).send({query})

export const privateTest = (
    app: INestApplication,
    query: string,
    token: string
) => baseTest(app).set('x-jwt', token).send({query})