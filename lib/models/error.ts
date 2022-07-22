import { ICreateError } from "../types";

export class ErrorResponse {
    constructor() {

    }
}


export const errorFactory = (payload: ICreateError | unknown): ErrorResponse => {
    return Object.assign(new ErrorResponse(), payload);
};