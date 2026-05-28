import { useEffect } from "react";
import { useGetExerciseList } from "../../hooks/useGetExerciseList";

const partMap : Record<number, string> = {
  1: "목관절",
  2: "어깨",
  3: "팔꿈치",
  8: "골반",
  9: "무릎",
  10: "발목"
}


export default function ExerciseContainer() {
  const params = new URLSearchParams(window.location.search);
  const t_r = params.get("t_r") || "";
  const { mutate, data: exercises, isPending, isError, error } = useGetExerciseList();
  useEffect(() => {
    if (t_r) {
      mutate(t_r);
    }
  }, [ t_r, mutate]);
  if (isPending) return <div className="p-4 text-center">파트 데이터를 불러오는 중...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">{error?.message}</div>;

  const realRiskPartArray = exercises?.risk_part?.risk_part?.risk_part || [];
  return (
    <div className="flex flex-col gap-2">
      <span className="text-start px-2 font-semibold">추천 운동 프로그램 위험 부위</span>

      <div className="flex flex-wrap gap-2 px-2">
        {/* 🟢 이제 완벽하게 number[]를 순회하므로 에러 없이 깔끔하게 작동합니다 */}
        {realRiskPartArray.map((partIdx) => (
          <span 
            key={partIdx} 
            className="px-2.5 py-1 bg-sub100 text-sub600 text-xs rounded-full font-medium"
          >
            {partMap[partIdx] || "기타 부위"}
          </span>
        ))}
        {/* TODO 여기서 파트+ 운동 썸네일 + 클릭으로 운동 영상 화면 보이게 하기  */}
      </div>
    </div>
  );
}