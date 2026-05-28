export const getRiskString = (level?: number | string) => {
  if (level === undefined || level === null) return undefined; 
  
  const numLevel = Number(level);
  if (numLevel >= 2) return "위험";
  if (numLevel >= 1) return "주의";
  return "정상";
};

export const getRangeCircle = (level?: number | string) => {
  if (level === undefined || level === null) return undefined; 
  
  const numLevel = Number(level);
  if (numLevel >= 2) return "③";
  if (numLevel >= 1) return "②";
  return "①";
};