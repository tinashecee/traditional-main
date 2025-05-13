export interface ErrorResponse {
  message: string;
}

export interface LoginResponse {
  token: string;
  province: string;
  role: string;
  district: string;
  username: string;
}

export interface SignupResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Represents a traditional administrative area (village, headmanship, or chieftainship)
 */
export interface TraditionalArea {
  id?: number;
  villageship_id?: number;
  villageship?: string;
  headmanship?: string;
  chieftainship?: string;
  province?: string;
  district?: string;
  succession_custom?: string;
  status?: string;
  households?: number;
}

/**
 * Represents a traditional leader (chief, headman, or village head)
 */
export interface VillageHeadsResponse {
  data: TraditionalLeader[];
}

export interface TraditionalLeader {
  id?: number;
  chief_id?: string;
  headman_id?: string;
  villagehead_id?: string;
  id_number?: string;
  leader_id?: string;
  type?: "chief" | "headman" | "villagehead";
  incumbent: string;
  district: string;
  province: string;
  chieftainship?: string;
  headmanship?: string;
  villageship?: string;
  villagemanship?: string;
  mutupo?: string;
  ecnumber?: string;
  gender?: string;
  dateofbirth?: string; // Consider using Date type after parsing
  dateofappointment?: string;
  status?: string;
  bank?: string;
  accountnumber?: string;
  contactnumber?: string;
  nextofkin?: string;
  biosignature?: string;
  picture?: string;
  spouses?: string;
  offspring?: string;
  car_reg_no?: string;
  dateofissue?: string; // Consider using Date type after parsing
  dateofdeathorremoval?: string;
  physicalladdress?: string;
  relationshiptolastincumbent?: string;
  lastincumbentname?: string;
  lastincumbentidnumber?: string;
  dateofvacancy?: string;
  reasonofvacancy?: string;
  personalattributesandqualifications?: string;
  disagreements?: string;
  otherinfo?: string;
  recommendationsfromheadman?: string;
  recommendationsfromchief?: string;
  supporting_document_ddc?: string;
  appointed_by?: string;
}

export interface MetricsLeader {
  type?: "chief" | "headman" | "villagehead";
  leader_id?: string;
  incumbent: string;
  dateofappointment?: string;
  dateofdeathorremoval?: string;
  province?: string;
  district?: string;
}

export interface MetricsResponse {
  appointments: MetricsLeader[];
  removals: MetricsLeader[];
}
