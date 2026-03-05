/**
 * Smart File Protocol
 */

export const openFile = (url) => {
    if (!url) return;
    window.open(url, '_blank');
};

export const forceDownload = async (url, filename) => {
    if (!url) return;

    let downloadUrl = url;
    if (downloadUrl.includes('cloudinary.com') && !downloadUrl.includes('fl_attachment')) {
        downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
    }

    try {
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename || 'submission_download');
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download Error:", error);
        window.open(downloadUrl, '_blank');
    }
};
