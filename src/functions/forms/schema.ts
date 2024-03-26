export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    ministry: { type: 'string' },
    dueDate: { type: 'string' },
    theme: { type: 'string' },
    description: { type: 'string' },
  },
  required: []
} as const;
