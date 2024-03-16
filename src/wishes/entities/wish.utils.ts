import { ValueTransformer } from 'typeorm';

class NumericTransformer implements ValueTransformer {
  to(data: number): number {
    return data;
  }

  from(data: string): number {
    return parseFloat(data);
  }
}

export default NumericTransformer;
