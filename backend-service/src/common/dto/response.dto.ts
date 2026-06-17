export class ResponseDto<T> {
    public Code: number;
    public Message: string;
    public Data: T;
    // public Timestamp: string;

    constructor(code: number, message: string, data: T) {
        this.Code = code;
        this.Message = message;
        this.Data = data;
        // this.Timestamp = new Date().toISOString();
    }
}