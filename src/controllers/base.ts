import { Response } from 'restify';
import { InnerResponse } from "types";

export class BaseController {
  public static handleResponse(result: InnerResponse, res: Response): void {
    res.status(result.status);
    res.send(result.data);
  };
}