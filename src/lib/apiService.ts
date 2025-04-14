import {
  LoginResponse,
  SignupResponse,
  ErrorResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  TraditionalLeader,
  TraditionalArea,
} from "./types";

const BASE_URL = "https://tlssapi.soxfort.com ";

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signup = async (
  username: string,
  email: string,
  phone_number: string,
  province: string,
  district: string,
  role: string,
  password: string
): Promise<SignupResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        phone_number,
        province,
        district,
        role,
        password,
      }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const forgotPassword = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

export const getVillageHeads = async (
  province?: string
): Promise<TraditionalLeader[]> => {
  try {
    const url = new URL(`${BASE_URL}/villageheads`);
    if (province) {
      url.searchParams.append("province", province);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching village heads:", error);
    throw error;
  }
};

export const getVillageHeadById = async (
  id: string
): Promise<TraditionalLeader> => {
  try {
    const response = await fetch(`${BASE_URL}/villageheads/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    if (!data) {
      throw new Error("Villagehead not found");
    }
    return data;
  } catch (error) {
    console.error("Error fetching village head by ID:", error);
    throw error;
  }
};

export const getChiefs = async (
  province?: string
): Promise<TraditionalLeader[]> => {
  try {
    const url = new URL(`${BASE_URL}/chiefs`);
    if (province) {
      url.searchParams.append("province", province);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("response:", response); // Debugging line
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chiefs:", error);
    throw error;
  }
};

export const getChiefById = async (id: string): Promise<TraditionalLeader> => {
  try {
    const response = await fetch(`${BASE_URL}/chiefs/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    if (!data) {
      throw new Error("Chief not found");
    }
    return data;
  } catch (error) {
    console.error("Error fetching chief by ID:", error);
    throw error;
  }
};

export const getHeadmen = async (
  province?: string
): Promise<TraditionalLeader[]> => {
  try {
    const url = new URL(`${BASE_URL}/headman`);
    if (province) {
      url.searchParams.append("province", province);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching headmen:", error);
    throw error;
  }
};

export const getHeadmanById = async (
  id: string
): Promise<TraditionalLeader> => {
  try {
    const response = await fetch(`${BASE_URL}/headman/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    if (!data) {
      throw new Error("Headman not found");
    }
    return data;
  } catch (error) {
    console.error("Error fetching headman by ID:", error);
    throw error;
  }
};

export const getVillageships = async (
  id?: string,
  province?: string
): Promise<TraditionalArea | TraditionalArea[]> => {
  try {
    const url = new URL(`${BASE_URL}/villageships`);
    if (id) url.searchParams.append("id", id);
    if (province) url.searchParams.append("province", province);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching villageships:", error);
    throw error;
  }
};

export const getHeadmanships = async (
  id?: string,
  province?: string
): Promise<TraditionalArea | TraditionalArea[]> => {
  try {
    const url = new URL(`${BASE_URL}/headmanships`);
    if (id) url.searchParams.append("id", id);
    if (province) url.searchParams.append("province", province);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching headmanships:", error);
    throw error;
  }
};

export const getChieftainships = async (
  id?: string,
  province?: string
): Promise<TraditionalArea | TraditionalArea[]> => {
  try {
    const url = new URL(`${BASE_URL}/chieftainships`);
    if (id) url.searchParams.append("id", id);
    if (province) url.searchParams.append("province", province);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chieftainships:", error);
    throw error;
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};
