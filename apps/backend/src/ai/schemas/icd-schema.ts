export const icdSchema = {
  name: 'icd_recommendation',
  description: 'Provides a list of suggested ICD-10 codes based on clinical evidence.',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      suggested_codes: {
        type: 'array',
        description: 'A list of one or more recommended ICD-10 codes.',
        items: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: "The specific ICD-10-CM code (e.g., 'I50.22').",
            },
            description: {
              type: 'string',
              description: 'The official description of the ICD-10 code.',
            },
            rationale: {
              type: 'string',
              description:
                'A concise explanation of why this code is recommended, citing specific clinical indicators.',
            },
          },
          required: ['code', 'description', 'rationale'],
        },
      },
      confidence_score: {
        type: 'number',
        description:
          "A score from 0.0 to 1.0 indicating the AI's confidence in the overall set of recommendations.",
      },
    },
    required: ['suggested_codes', 'confidence_score'],
    additionalProperties: false,
  },
} as const;


