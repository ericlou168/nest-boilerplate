import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { PhoneNumber } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'IsPhoneNumberX', async: false })
class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(propertyValue: PhoneNumber, _args: ValidationArguments) {
    if (propertyValue && typeof propertyValue === 'object') {
      return !!propertyValue.country;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not valid format.`;
  }
}

// phone.countryCallingCode // 855
// phone.nationalNumber 10123456
// phone.number +85510123456
// phone: user.phone
export const IsPhoneNumber = (validationOptions?: ValidationOptions): PropertyDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as never,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint
    });
  };
};
