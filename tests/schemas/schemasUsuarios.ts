import { kMaxLength } from "node:buffer";

export const userSchema = {
  type: 'object',
  properties: {
    nome: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 },
    administrador: { type: 'string', enum: ['true', 'false'] },
    _id: { type: 'string', minLength: 1 , maxLength: 16},
  },
  required: ['nome', 'email', 'password', 'administrador', '_id'],
  additionalProperties: false,
};

export const userListSchema = {
  type: 'object',
  properties: {
    quantidade: { type: 'number', minimum: 0 },
    usuarios: {
      type: 'array',
      items: userSchema,
    },
  },
  required: ['quantidade', 'usuarios'],
  additionalProperties: false,
};

export const createUserResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    _id: { type: 'string', minLength: 1 },
  },
  required: ['message', '_id'],
  additionalProperties: false,
};

export const updateUserResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: false,
};

export const deleteUserResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: false,
};

export const errorResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: true,
};