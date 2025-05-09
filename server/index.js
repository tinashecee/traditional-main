const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Client } = require("basic-ftp");
const path = require("path");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// FTP configuration
const ftpConfig = {
  host: "137.184.221.205",
  user: "ftpuser",
  password: "Tlss_2025#",
  secure: false,
};

// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("Received request on /upload");

  if (!req.file) {
    console.warn("No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("Uploaded file details:", req.file);

  const client = new Client();
  try {
    await client.access(ftpConfig);
    console.log("Connected to FTP server");

    const timestamp = Date.now();
    const filename = `${timestamp}-${req.file.originalname}`;
    const remotePath = `/uploads/${filename}`;

    console.log(`Uploading to ${remotePath}`);
    await client.uploadFrom(req.file.path, remotePath);
    console.log(`File uploaded successfully to ${remotePath}`);

    res.json({
      success: true,
      filePath: remotePath,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      error: "File upload failed",
      details: err.message,
    });
  } finally {
    client.close();
    console.log("FTP connection closed");
  }
});

// Headman document upload endpoint
app.post(
  "/upload/headman",
  upload.fields([
    { name: "recommendationsfromchief", maxCount: 1 },
    { name: "supporting_document_ddc", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Received request on /upload/headman");

    if (!req.files) {
      console.warn("No files uploaded");
      return res.status(400).json({ error: "No files uploaded" });
    }

    console.log("Uploaded files:", req.files);

    const client = new Client();
    try {
      await client.access(ftpConfig);
      console.log("Connected to FTP server");

      const timestamp = Date.now();
      const filePaths = {};

      if (req.files.recommendationsfromchief) {
        const chiefFile = req.files.recommendationsfromchief[0];
        const chiefFilename = `${timestamp}-chief-${chiefFile.originalname}`;
        const chiefRemotePath = `/uploads/${chiefFilename}`;
        console.log(`Uploading chief file to ${chiefRemotePath}`);
        await client.uploadFrom(chiefFile.path, chiefRemotePath);
        filePaths.recommendationsfromchief = chiefRemotePath;
      }

      if (req.files.supporting_document_ddc) {
        const ddcFile = req.files.supporting_document_ddc[0];
        const ddcFilename = `${timestamp}-ddc-${ddcFile.originalname}`;
        const ddcRemotePath = `/uploads/${ddcFilename}`;
        console.log(`Uploading DDC file to ${ddcRemotePath}`);
        await client.uploadFrom(ddcFile.path, ddcRemotePath);
        filePaths.supporting_document_ddc = ddcRemotePath;
      }

      console.log("All files uploaded successfully:", filePaths);
      res.json({
        success: true,
        filePaths: filePaths,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({
        error: "File upload failed",
        details: err.message,
      });
    } finally {
      client.close();
      console.log("FTP connection closed");
    }
  }
);

// Village head documents upload endpoint
app.post(
  "/upload/villagehead",
  upload.fields([
    { name: "recommendationsfromchief", maxCount: 1 },
    { name: "recommendationsfromheadman", maxCount: 1 },
    { name: "supporting_document_ddc", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Received files:", req.files); // Debug log

    if (!req.files) {
      console.log("No files received"); // Debug log
      return res.status(400).json({ error: "No files uploaded" });
    }

    const client = new Client();
    try {
      await client.access(ftpConfig);
      const timestamp = Date.now();
      const filePaths = {};

      console.log("Processing recommendationsfromchief..."); // Debug log
      if (req.files.recommendationsfromchief) {
        const chiefFile = req.files.recommendationsfromchief[0];
        console.log("Chief file details:", chiefFile); // Debug log
        const chiefFilename = `${timestamp}-chief-${chiefFile.originalname}`;
        const chiefRemotePath = `/uploads/${chiefFilename}`;
        await client.uploadFrom(chiefFile.path, chiefRemotePath);
        filePaths.recommendationsfromchief = chiefRemotePath;
      }

      console.log("Processing recommendationsfromheadman..."); // Debug log
      if (req.files.recommendationsfromheadman) {
        const headmanFile = req.files.recommendationsfromheadman[0];
        console.log("Headman file details:", headmanFile); // Debug log
        const headmanFilename = `${timestamp}-headman-${headmanFile.originalname}`;
        const headmanRemotePath = `/uploads/${headmanFilename}`;
        await client.uploadFrom(headmanFile.path, headmanRemotePath);
        filePaths.recommendationsfromheadman = headmanRemotePath;
      }

      console.log("Processing supporting_document_ddc..."); // Debug log
      if (req.files.supporting_document_ddc) {
        const ddcFile = req.files.supporting_document_ddc[0];
        console.log("DDC file details:", ddcFile); // Debug log
        const ddcFilename = `${timestamp}-ddc-${ddcFile.originalname}`;
        const ddcRemotePath = `/uploads/${ddcFilename}`;
        await client.uploadFrom(ddcFile.path, ddcRemotePath);
        filePaths.supporting_document_ddc = ddcRemotePath;
      }

      console.log("Final filePaths:", filePaths); // Debug log

      res.json({
        success: true,
        filePaths: filePaths,
      });
    } catch (err) {
      console.error("Upload error details:", err); // Debug log
      res.status(500).json({
        error: "File upload failed",
        details: err.message,
      });
    } finally {
      client.close();
    }
  }
);

// Chief update endpoint
app.post("/upload/chief-update", upload.single("file"), async (req, res) => {
  const client = new Client();

  try {
    await client.access(ftpConfig);

    const { fileType, currentFilePath } = req.body;
    const file = req.file;

    if (!file || !fileType) {
      return res.status(400).json({ error: "File and file type are required" });
    }

    // Delete old file if path was provided
    if (currentFilePath) {
      try {
        await client.remove(currentFilePath);
        console.log(`Old file removed: ${currentFilePath}`);
      } catch (err) {
        console.error(`Error removing old file: ${currentFilePath}`, err);
      }
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}-${fileType}-${file.originalname}`;
    const remotePath = `/uploads/${fileName}`;

    // Upload new file
    await client.uploadFrom(file.path, remotePath);
    console.log(`New file uploaded to: ${remotePath}`);

    res.json({
      success: true,
      filePath: remotePath,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      error: "File upload failed",
      details: err.message,
    });
  } finally {
    client.close();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
