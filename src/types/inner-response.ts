import { ResponseData } from './response-data';

export class InnerResponse {
  status: number;
  data: ResponseData;

  constructor(status: number, data: any) {
    this.status = status;
    this.data = {
      success: status < 300,
      ...data,
    };
  }
}
