export class InnerResponse {
  status: number;
  data: ResponseData;

  constructor(status: number, data: any) {
    this.status = status;
    this.data = {
      success: status < 300,
      ...data
    };
  }
}

export class ResponseData {
  success: boolean;
  [key: string]: any;
}