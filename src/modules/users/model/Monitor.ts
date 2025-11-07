export interface Profile {
  rfid?: string;
  names?: string;
  surnames?: string;
  phone?: string;
  document_id?: string;
}

export interface Monitor {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  state: string;
  role: string;
  profile: Profile;
}
