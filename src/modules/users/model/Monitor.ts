export interface Monitor {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  state: string;
  role: string;
  profile: string;
  phone?: string;
  rfid?: string;
  names?: string;
  surnames?: string;
}
