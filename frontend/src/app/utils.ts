export const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (url && url !== "undefined") {
    return url;
  }

  // Browser fallback
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8002`;
  }

  // Server-side fallback
  return "http://10.224.235.31:8002";
};

export const getMinioUrl = () => {
  const url = process.env.NEXT_PUBLIC_MINIO_URL;

  if (url && url !== "undefined") {
    return url;
  }

  // Browser fallback
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:9010/pm-photos`;
  }

  // Server-side fallback
  return "http://10.224.235.31:9010/pm-photos";
};
