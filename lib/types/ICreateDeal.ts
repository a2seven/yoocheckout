import { IDealFeeMoment, IDealType } from '.';

export interface ICreateDeal {
  type: IDealType;
  fee_moment: IDealFeeMoment;
  metadata?: any;
  description?: string;
}
