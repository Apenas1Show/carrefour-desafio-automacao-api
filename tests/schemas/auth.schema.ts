export const loginSuccessSchema = {
  type: 'object',
  properties: {
    message: { 
      type: 'string',
      const: 'Login realizado com sucesso'
    },
    authorization: { 
      type: 'string',
      pattern: '^Bearer .+',
      minLength: 20
    },
  },
  required: ['message', 'authorization'],
  additionalProperties: false,
};

export const loginErrorSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
  additionalProperties: true,
};