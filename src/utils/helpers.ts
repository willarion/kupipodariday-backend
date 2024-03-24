import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

export const saveWithValidation = async (entity, saveFunction) => {
  const errors = await validate(entity, { skipMissingProperties: true });
  if (errors.length > 0) {
    const validationErrors = errors
      .map((error) => Object.values(error.constraints))
      .join(', ');
    throw new BadRequestException(`Validation failed: ${validationErrors}`);
  }
  return saveFunction(entity);
};
