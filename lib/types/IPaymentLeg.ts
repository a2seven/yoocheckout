export interface IPaymentLeg {
    departure_airport: string;
    destination_airport: string;
    departure_date: string;
    carrier_code?: string;
}