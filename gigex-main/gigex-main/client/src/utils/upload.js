const upload = async (file) => {
  try {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "gigex_upload"); // ✅ Updated preset

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/gigexcloud/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.url;
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
};

export default upload;