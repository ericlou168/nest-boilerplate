import { Transform } from 'class-transformer';

/**
 * Transform input to number. default is 0.
 */
// eslint-disable-next-line no-restricted-globals
export const TransformToNumber = () => Transform(({ value }) => (isNaN(+value) ? 0 : +value));
