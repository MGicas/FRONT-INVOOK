export interface ConsumLender {
   id: string | number;
   names: string;
   surnames: string;
   email: string;
 }

 export interface ConsumMonitorProfile {
   rfid?: string;
   names?: string;
   surnames?: string;
   phone?: string;
   document_id?: string;
 }

 export interface ConsumMonitor {
   id: string | number;
   username: string;
   email: string;
   first_name: string;
   last_name: string;
   profile?: ConsumMonitorProfile;
 }

 export interface DeliveredSupply {
   id?: string | number;
   name: string;
   quantity?: number;
 }

 export interface Consum {
   id: string | number;
   user: ConsumLender; // Usuario que recibe el consumo
   monitor: ConsumMonitor; // Monitor que entrega
   supplies: DeliveredSupply[]; // Suministros entregados
   created_at?: string; // fecha del consumo
 }