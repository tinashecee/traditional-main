export async function handleChiefFileUpload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.filePath;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function handleChiefFileUpdate(
  file: File,
  fileType: "picture" | "recommendationsfromheadman",
  currentFilePath?: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);
  if (currentFilePath) {
    formData.append("currentFilePath", currentFilePath);
  }

  try {
    const response = await fetch(`http://localhost:3001/upload/chief-update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.filePath;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function handleHeadmanFileUpload(
  chiefFile: File,
  ddcFile: File
): Promise<{
  recommendationsfromchief: string;
  supporting_document_ddc: string;
}> {
  const formData = new FormData();
  formData.append("recommendationsfromchief", chiefFile);
  formData.append("supporting_document_ddc", ddcFile);

  try {
    const response = await fetch("http://localhost:3001/upload/headman", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return {
      recommendationsfromchief: data.filePaths.recommendationsfromchief,
      supporting_document_ddc: data.filePaths.supporting_document_ddc,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function handleVillageHeadFileUpload(
  chiefFile: File,
  headmanFile: File,
  ddcFile: File
): Promise<{
  recommendationsfromchief: string;
  recommendationsfromheadman: string;
  supporting_document_ddc: string;
}> {
  console.log("Files to upload:", { chiefFile, headmanFile, ddcFile }); // Debug log

  const formData = new FormData();
  formData.append("recommendationsfromchief", chiefFile);
  formData.append("recommendationsfromheadman", headmanFile);
  formData.append("supporting_document_ddc", ddcFile);

  // Debug log FormData contents
  for (const pair of formData.entries()) {
    console.log("FormData content:", pair[0], pair[1]);
  }

  try {
    const response = await fetch("http://localhost:3001/upload/villagehead", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Upload response error:", errorData); // Debug log
      throw new Error(errorData.error || "Upload failed");
    }

    const data = await response.json();
    console.log("Upload response data:", data); // Debug log

    if (!data.filePaths) {
      throw new Error("No file paths returned from server");
    }

    return {
      recommendationsfromchief: data.filePaths.recommendationsfromchief,
      recommendationsfromheadman: data.filePaths.recommendationsfromheadman,
      supporting_document_ddc: data.filePaths.supporting_document_ddc,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
