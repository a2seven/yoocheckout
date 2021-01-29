import { IPassenger, IPaymentLeg } from ".";

export interface IAirline {
    account_id?: string;
    ticket_number?: string;
    booking_reference?: string;
    passengers?: IPassenger[];
    legs?: IPaymentLeg[];
}


export type IAirlineWithoutId = Omit<IAirline, 'account_id'>;