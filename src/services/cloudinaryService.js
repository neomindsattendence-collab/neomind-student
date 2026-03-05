const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const uploadToCloudinary = async (file) => {
    if (!file) throw new Error("No file selected.");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET.trim());

    // 🛡️ Use 'auto' to handle PDF, Images, etc automatically
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME.trim()}/auto/upload`;

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Upload failed');
        }

        return {
            url: result.secure_url,
            id: result.public_id,
            resource_type: result.resource_type
        };
    } catch (err) {
        console.error("Cloudinary Error:", err);
        throw err;
    }
};
