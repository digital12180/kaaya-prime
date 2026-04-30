// src/validators/rental-yield.validator.ts
import Joi from "joi";

export const createRentalYieldSchema = Joi.object({
  area: Joi.string().required().trim().min(2).max(100),
  value: Joi.number().required().min(0).max(100).precision(1),
  width: Joi.number().required().min(0).max(100),
  quarter: Joi.string().required().pattern(/^Q[1-4]\s\d{4}$/).messages({
    "string.pattern.base": "Quarter must be in format 'Q1 2024'",
  }),
  label: Joi.string().optional(),
});

export const updateRentalYieldSchema = Joi.object({
  area: Joi.string().trim().min(2).max(100),
  value: Joi.number().min(0).max(100).precision(1),
  width: Joi.number().min(0).max(100),
  quarter: Joi.string().pattern(/^Q[1-4]\s\d{4}$/),
  label: Joi.string(),
}).min(1);

export const bulkCreateRentalYieldSchema = Joi.object({
  type: Joi.string().required().valid("yield-bars"),
  label: Joi.string().required(),
  data: Joi.array().items(
    Joi.object({
      area: Joi.string().required(),
      value: Joi.string().required().pattern(/^\d+(\.\d+)?%$/),
      width: Joi.number().required(),
    })
  ).min(1).required(),
});


export const createDeveloperScoreSchema = Joi.object({
  developer: Joi.string().required().trim().min(2).max(100),
  score: Joi.number().required().min(0).max(100),
  dashOffset: Joi.number().min(0).max(100).optional(),
  type: Joi.string().default("developer-gauges"),
  label: Joi.string().required(),
  quarter: Joi.string().pattern(/^Q[1-4]\s\d{4}$/).optional().allow(null),
});

export const updateDeveloperScoreSchema = Joi.object({
  developer: Joi.string().trim().min(2).max(100),
  score: Joi.number().min(0).max(100),
  dashOffset: Joi.number().min(0).max(100),
  label: Joi.string(),
  quarter: Joi.string().pattern(/^Q[1-4]\s\d{4}$/).allow(null),
}).min(1);

export const bulkCreateDeveloperScoreSchema = Joi.object({
  type: Joi.string().required().valid("developer-gauges"),
  label: Joi.string().required(),
  data: Joi.array().items(
    Joi.object({
      developer: Joi.string().required(),
      score: Joi.number().required(),
      dashOffset: Joi.number().optional(),
    })
  ).min(1).required(),
});

export const updateMultipleScoresSchema = Joi.object({
  scores: Joi.array().items(
    Joi.object({
      developer: Joi.string().required(),
      score: Joi.number().required(),
      dashOffset: Joi.number().optional(),
    })
  ).min(1).required(),
  quarter: Joi.string().pattern(/^Q[1-4]\s\d{4}$/).optional(),
});