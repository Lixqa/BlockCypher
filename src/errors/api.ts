export class ApiError extends Error {
  status: number;
  statusText: string;
  url: string;
  body: any;

  constructor(response: { status: number; statusText: string; url: string; body: any }) {
    super(`An unexpected API Error occured: ${response.statusText} (${response.status})`);
    this.name = 'API Error';

    this.status = response.status;
    this.statusText = response.statusText;
    this.url = response.url;
    this.body = response.body;
  }
}
