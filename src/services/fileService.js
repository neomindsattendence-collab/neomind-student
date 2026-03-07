/**
 * FILE PROTOCOL (v4.0 - Base)
 * Optimized for Student Viewing / Downloading
 */

// 🛡️ Open/View Resource
export const openFile = (url) => {
    if (!url) return;

    // Safety check: remove any previously added flags
    let viewUrl = url;
    if (viewUrl.includes('cloudinary.com')) {
        viewUrl = viewUrl.replace('/fl_attachment/', '/');
    }

    const win = window.open(viewUrl, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Blocked: Please allow popups.');
    }
};

// 🛡️ Safe Download Resource
export const forceDownload = (url, filename) => {
    if (!url) return;

    // Use pure URL for binary integrity
    let downloadUrl = url;
    if (downloadUrl.includes('cloudinary.com')) {
        downloadUrl = downloadUrl.replace('/fl_attachment/', '/');
    }

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = "_blank";

    // Explicitly request download with filename
    link.setAttribute('download', filename || 'neominds_student_resource');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
