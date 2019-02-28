export class Item {
    public mac: string;
    public seqNo: number;
    public location: string;
    public port: string;
    public created_at: Date;
    public created_by: string;
    public joined: boolean;
    public complete: boolean;
    public checkedIn: boolean;
    public $key: string;

    constructor(mac: string, location: string, port: string, created_at: Date, created_by: string,
        joined: boolean, complete: boolean, checkedIn: boolean) {
      this.mac = mac;
      this.location = location;
      this.port = port;
      this.created_at = created_at;
      this.created_by = created_by;
      this.joined = joined;
      this.complete = complete;
      this.checkedIn = checkedIn;
    }
  }
