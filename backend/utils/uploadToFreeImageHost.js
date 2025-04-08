const axios = require("axios");
const FormData = require("form-data");

/**
 * Uploads an image to freeimage.host
 * @param {string} imageBase64 - Base64 encoded image data (without the data:image/png;base64, prefix)
 * @returns {Promise<string>} - URL of the uploaded image
 */
const uploadToFreeImageHost = async (imageBase64) => {
    const api_key = process.env.FREEIMAGE_API_KEY || "6d207e02198a847aa98d0a2a901485a5";
    const api_url = "https://freeimage.host/api/1/upload";
    const formData = new FormData();
    formData.append("key", api_key);
    formData.append("source", imageBase64);
    formData.append("action", "upload");
    formData.append("format", "json");

    try {
        const response = await axios.post(api_url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200) {
            return response.data.image.url;
        } else {
            throw new Error("Failed to upload image");
        }
    } catch (error) {
        console.error("Error uploading image:", error.message);
        throw error;
    }
};

module.exports = { uploadToFreeImageHost };
