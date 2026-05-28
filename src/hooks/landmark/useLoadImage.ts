export function useLoadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.crossOrigin = "anonymous"; 
    
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      console.error("이미지 로딩 실패:", src, err);
      reject(err);
    };
    
    img.src = src;
  });
}