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

export const defaultValues = {
  about: 'Пока ничего не рассказал о себе',
  avatar: 'https://i.pravatar.cc/300',
};
