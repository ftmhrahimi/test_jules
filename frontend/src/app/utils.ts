export const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || url === 'undefined') {
    // Fallback to current host if we're in the browser
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
    return 'http://localhost:8000';
  }
  return url;
};

export const getMinioUrl = () => {
  const url = process.env.NEXT_PUBLIC_MINIO_URL;
  if (!url || url === 'undefined') {
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:9000/pm-photos`;
    }
    return 'http://localhost:9000/pm-photos';
  }
  return url;
};
