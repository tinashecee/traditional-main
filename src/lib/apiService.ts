import {
  handleChiefFileUpdate,
  handleHeadmanFileUpdate,
  handleVillageHeadFileUpdate,
} from "./ftpUtils";
import {
  LoginResponse,
  SignupResponse,
  ErrorResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  TraditionalLeader,
  TraditionalArea,
} from "./types";

const BASE_URL = "https://tlssapi.soxfort.com";
//const BASE_URL = "http://localhost:3000";
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
    const url = new URL(`${BASE_URL}/headmen`);
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

export const appointChief = async (
  chief: Partial<TraditionalLeader>
): Promise<{ message: string }> => {
  try {
    // Validate required fields
    const requiredFields = [
      "id_number",
      "incumbent",
      "district",
      "province",
      "chieftainship",
      "gender",
      "dateofbirth",
      "dateofappointment",
      "status",
    ];

    const missingFields = requiredFields.filter((field) => !chief[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Format the data to match API expectations
    const formattedChief = {
      chief_id: chief.id_number,
      id_number: chief.id_number,
      incumbent: chief.incumbent,
      district: chief.district,
      province: chief.province,
      chieftainship: chief.chieftainship,
      mutupo: chief.mutupo || "",
      ecnumber: chief.ecnumber || null,
      gender: chief.gender,
      dateofbirth: chief.dateofbirth,
      dateofappointment: chief.dateofappointment,
      status: chief.status,
      bank: chief.bank || null,
      accountnumber: chief.accountnumber || null,
      contactnumber: chief.contactnumber || "",
      nextofkin: chief.nextofkin || null,
      biosignature: chief.biosignature || null,
      picture: chief.picture || null,
      spouses: chief.spouses || null,
      offspring: chief.offspring || null,
      car_reg_no: chief.car_reg_no || null,
      dateofissue: chief.dateofissue || null,
      dateofdeathorremoval: chief.dateofdeathorremoval || null,
      physicalladdress: chief.physicalladdress || "",
      relationshiptolastincumbent: chief.relationshiptolastincumbent || null,
      lastincumbentname: chief.lastincumbentname || null,
      lastincumbentidnumber: chief.lastincumbentidnumber || null,
      dateofvacancy: chief.dateofvacancy || null,
      reasonofvacancy: chief.reasonofvacancy || null,
      personalattributesandqualifications:
        chief.personalattributesandqualifications || null,
      disagreements: chief.disagreements || null,
      otherinfo: chief.otherinfo || null,
      recommendationsfromheadman: chief.recommendationsfromheadman || null,
    };

    console.log("Formatted chief data:", formattedChief); // Debugging line

    const response = await fetch(`${BASE_URL}/appoint/chiefs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formattedChief),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to appoint chief");
    }

    return await response.json();
  } catch (error) {
    console.error("Error appointing chiefs:", error);
    throw error;
  }
};

export const appointHeadman = async (
  headman: Partial<TraditionalLeader>
): Promise<{ message: string }> => {
  try {
    // Validate required fields
    const requiredFields = [
      "id_number",
      "incumbent",
      "district",
      "province",
      "chieftainship",
      "headmanship",
      "gender",
      "dateofbirth",
      "dateofappointment",
      "status",
    ];

    const missingFields = requiredFields.filter((field) => !headman[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Format the data to match API expectations
    const formattedHeadman = {
      headman_id: headman.id_number,
      id_number: headman.id_number,
      incumbent: headman.incumbent,
      district: headman.district,
      province: headman.province,
      chieftainship: headman.chieftainship,
      headmanship: headman.headmanship,
      mutupo: headman.mutupo || "",
      ecnumber: headman.ecnumber || null,
      gender: headman.gender,
      dateofbirth: headman.dateofbirth,
      dateofappointment: headman.dateofappointment,
      status: headman.status,
      bank: headman.bank || null,
      accountnumber: headman.accountnumber || null,
      contactnumber: headman.contactnumber || "",
      nextofkin: headman.nextofkin || null,
      biosignature: headman.biosignature || null,
      picture: headman.picture || null,
      spouses: headman.spouses || null,
      offspring: headman.offspring || null,
      dateofissue: headman.dateofissue || null,
      dateofdeathorremoval: headman.dateofdeathorremoval || null,
      physicalladdress: headman.physicalladdress || "",
      relationshiptolastincumbent: headman.relationshiptolastincumbent || null,
      lastincumbentname: headman.lastincumbentname || null,
      lastincumbentidnumber: headman.lastincumbentidnumber || null,
      dateofvacancy: headman.dateofvacancy || null,
      reasonofvacancy: headman.reasonofvacancy || null,
      personalattributesandqualifications:
        headman.personalattributesandqualifications || null,
      disagreements: headman.disagreements || null,
      otherinfo: headman.otherinfo || null,
      recommendationsfromchief: headman.recommendationsfromchief || null,
      supporting_document_ddc: headman.supporting_document_ddc || null,
    };

    const response = await fetch(`${BASE_URL}/appoint/headman`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formattedHeadman),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to appoint headman");
    }

    return await response.json();
  } catch (error) {
    console.error("Error appointing headman:", error);
    throw error;
  }
};

export const appointVillageHead = async (
  villageHead: Partial<TraditionalLeader>
): Promise<{ message: string }> => {
  try {
    // Validate required fields
    const requiredFields = [
      "id_number",
      "incumbent",
      "district",
      "province",
      "chieftainship",
      "headmanship",
      "villagemanship",
      "gender",
      "dateofbirth",
      "dateofappointment",
      "status",
    ];

    const missingFields = requiredFields.filter((field) => !villageHead[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Format the data to match API expectations
    const formattedVillageHead = {
      villagehead_id: villageHead.id_number,
      id_number: villageHead.id_number,
      incumbent: villageHead.incumbent,
      district: villageHead.district,
      province: villageHead.province,
      chieftainship: villageHead.chieftainship,
      headmanship: villageHead.headmanship,
      villagemanship: villageHead.villagemanship,
      mutupo: villageHead.mutupo || "",
      ecnumber: villageHead.ecnumber || null,
      gender: villageHead.gender,
      dateofbirth: villageHead.dateofbirth,
      dateofappointment: villageHead.dateofappointment,
      status: villageHead.status,
      spouses: villageHead.spouses || null,
      physicalladdress: villageHead.physicalladdress || "",
      relationshiptolastincumbent:
        villageHead.relationshiptolastincumbent || null,
      lastincumbentname: villageHead.lastincumbentname || null,
      lastincumbentidnumber: villageHead.lastincumbentidnumber || null,
      dateofvacancy: villageHead.dateofvacancy || null,
      reasonofvacancy: villageHead.reasonofvacancy || null,
      personalattributesandqualifications:
        villageHead.personalattributesandqualifications || null,
      disagreements: villageHead.disagreements || null,
      otherinfo: villageHead.otherinfo || null,
      recommendationsfromchief: villageHead.recommendationsfromchief || null,
      recommendationsfromheadman:
        villageHead.recommendationsfromheadman || null,
      supporting_document_ddc: villageHead.supporting_document_ddc || null,
    };
    console.log("Formatted village head data:", formattedVillageHead); // Debugging line

    const response = await fetch(`${BASE_URL}/appoint/villagehead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formattedVillageHead),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to appoint village head");
    }

    return await response.json();
  } catch (error) {
    console.error("Error appointing village head:", error);
    throw error;
  }
};

export const getMonthlyAppointments = async (): Promise<{
  chiefs: TraditionalLeader[];
  headmen: TraditionalLeader[];
  villageheads: TraditionalLeader[];
}> => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Format dates for API
    const startDate = firstDayOfMonth.toISOString().split("T")[0];
    const endDate = lastDayOfMonth.toISOString().split("T")[0];

    // Change endpoints to match your cloud API routes
    const [chiefs, headmen, villageheads] = await Promise.all([
      fetch(`${BASE_URL}/chiefs?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json()),
      fetch(`${BASE_URL}/headmen?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json()),
      fetch(
        `${BASE_URL}/villageheads?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((res) => res.json()),
    ]);

    return { chiefs, headmen, villageheads };
  } catch (error) {
    console.error("Error fetching monthly appointments:", error);
    throw error;
  }
};

// Add this function to handle file uploads
export const updateChiefFiles = async (
  chiefId: string,
  files: { picture?: File; recommendationsfromheadman?: File },
  currentFilePath?: string
): Promise<{
  picture?: string;
  recommendationsfromheadman?: string;
}> => {
  try {
    const formData = new FormData();
    if (files.picture) {
      formData.append("picture", files.picture);
    }
    if (files.recommendationsfromheadman) {
      formData.append(
        "recommendationsfromheadman",
        files.recommendationsfromheadman
      );
    }
    // Add current filepath if exists
    if (currentFilePath) {
      formData.append("currentFilePath", currentFilePath);
    }

    const uploadResults: {
      picture?: string;
      recommendationsfromheadman?: string;
    } = {};

    // Handle picture upload
    if (files.picture) {
      const picturePath = await handleChiefFileUpdate(
        files.picture,
        "picture",
        currentFilePath
      );
      uploadResults.picture = picturePath;
    }

    // Handle recommendations upload
    if (files.recommendationsfromheadman) {
      const recommendationsPath = await handleChiefFileUpdate(
        files.recommendationsfromheadman,
        "recommendationsfromheadman",
        currentFilePath
      );
      uploadResults.recommendationsfromheadman = recommendationsPath;
    }

    // Update database with new file paths
    const response = await fetch(`${BASE_URL}/chiefs/${chiefId}/documents`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(uploadResults),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to update file paths");
    }

    return uploadResults;
  } catch (error) {
    console.error("Error updating chief files:", error);
    throw error;
  }
};

// Add this function to update chief data
export const updateChief = async (
  chiefId: string,
  data: Partial<TraditionalLeader>
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/chiefs/${chiefId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to update chief");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating chief:", error);
    throw error;
  }
};

// Add this function to update headman data
export const updateHeadman = async (
  headmanId: string,
  data: Partial<TraditionalLeader>
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/headmen/${headmanId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to update headman");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating headman:", error);
    throw error;
  }
};
export const updateHeadmanFiles = async (
  headmanId: string,
  files: {
    picture?: File;
    recommendationsfromchief?: File;
    supporting_document_ddc?: File;
  },
  currentFilePath?: string
): Promise<{
  picture?: string;
  recommendationsfromchief?: string;
  supporting_document_ddc?: string;
}> => {
  try {
    const uploadResults: {
      picture?: string;
      recommendationsfromchief?: string;
      supporting_document_ddc?: string;
    } = {};

    // Handle picture upload
    if (files.picture) {
      const picturePath = await handleHeadmanFileUpdate(
        files.picture,
        "picture",
        currentFilePath
      );
      uploadResults.picture = picturePath;
    }

    // Handle recommendations upload
    if (files.recommendationsfromchief) {
      const recommendationsPath = await handleHeadmanFileUpdate(
        files.recommendationsfromchief,
        "recommendationsfromchief",
        currentFilePath
      );
      uploadResults.recommendationsfromchief = recommendationsPath;
    }

    // Handle supporting document upload
    if (files.supporting_document_ddc) {
      const supportingDocPath = await handleHeadmanFileUpdate(
        files.supporting_document_ddc,
        "supporting_document_ddc",
        currentFilePath
      );
      uploadResults.supporting_document_ddc = supportingDocPath;
    }

    // Update database with new file paths
    const response = await fetch(`${BASE_URL}/headmen/${headmanId}/documents`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(uploadResults),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to update file paths");
    }

    return uploadResults;
  } catch (error) {
    console.error("Error updating headman files:", error);
    throw error;
  }
};

// Add this function to update village head data
export const updateVillageHead = async (
  villageHeadId: string,
  data: Partial<TraditionalLeader>
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/villageheads/${villageHeadId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to update village head");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating village head:", error);
    throw error;
  }
};

export const updateVillageHeadFiles = async (
  villageHeadId: string,
  files: {
    picture?: File;
    recommendationsfromchief?: File;
    recommendationsfromheadman?: File;
    supporting_document_ddc?: File;
  },
  currentFilePath?: string
): Promise<{
  picture?: string;
  recommendationsfromchief?: string;
  recommendationsfromheadman?: string;
  supporting_document_ddc?: string;
}> => {
  try {
    const uploadResults: {
      picture?: string;
      recommendationsfromchief?: string;
      recommendationsfromheadman?: string;
      supporting_document_ddc?: string;
    } = {};

    // Handle picture upload
    if (files.picture) {
      const picturePath = await handleVillageHeadFileUpdate(
        files.picture,
        "picture",
        currentFilePath
      );
      uploadResults.picture = picturePath;
    }

    // Handle chief recommendations upload
    if (files.recommendationsfromchief) {
      const chiefRecommendationsPath = await handleVillageHeadFileUpdate(
        files.recommendationsfromchief,
        "recommendationsfromchief",
        currentFilePath
      );
      uploadResults.recommendationsfromchief = chiefRecommendationsPath;
    }

    // Handle headman recommendations upload
    if (files.recommendationsfromheadman) {
      const headmanRecommendationsPath = await handleVillageHeadFileUpdate(
        files.recommendationsfromheadman,
        "recommendationsfromheadman",
        currentFilePath
      );
      uploadResults.recommendationsfromheadman = headmanRecommendationsPath;
    }

    // Handle supporting document upload
    if (files.supporting_document_ddc) {
      const supportingDocPath = await handleVillageHeadFileUpdate(
        files.supporting_document_ddc,
        "supporting_document_ddc",
        currentFilePath
      );
      uploadResults.supporting_document_ddc = supportingDocPath;
    }

    // Update database with new file paths
    const response = await fetch(
      `${BASE_URL}/villageheads/${villageHeadId}/documents`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(uploadResults),
      }
    );

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to update file paths");
    }

    return uploadResults;
  } catch (error) {
    console.error("Error updating village head files:", error);
    throw error;
  }
};
