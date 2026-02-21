const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // 🛡️ PROTOCOL FIX: Ensure PDFs are handled as 'raw' for browser rendering compatibility
    const isPDF = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const resourceType = isPDF ? 'raw' : 'image';

    formData.append('resource_type', resourceType);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }

        const result = await response.json();
        return {
            url: result.secure_url,
            id: result.public_id,
            format: result.format,
            bytes: result.bytes
        };
    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        throw err;
    }
};
