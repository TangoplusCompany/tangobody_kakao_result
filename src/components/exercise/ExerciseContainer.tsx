import { useEffect, useMemo, useState } from "react";
import { useGetExerciseList } from "../../hooks/useGetExerciseList";
import ExerciseList from "./ExcerciseList";
import ExerciseDetail from "./ExerciseDetail";


const partMap: Record<number, string> = {
  1: "목관절",
  2: "어깨",
  3: "팔꿈치",
  8: "골반",
  9: "무릎",
  10: "발목"
};

export default function ExerciseContainer() {
  const [selectedPartTab, setSelectedPartTab] = useState<number | null>(null);
  const params = new URLSearchParams(window.location.search);
  const t_r = params.get("t_r") || "";
  const { mutate, data: exercises, isPending, isError, error } = useGetExerciseList();
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  useEffect(() => {
    if (t_r) {
      mutate(t_r);
    }
  }, [t_r, mutate]);

  const realRiskPartArray = useMemo(() => {
    return exercises?.risk_part?.risk_part || [];
  }, [exercises]);

  const currentPartTab = selectedPartTab !== null ? selectedPartTab : realRiskPartArray[0];
  const currentPartIndex = selectedPartTab !== null 
    ? realRiskPartArray.indexOf(selectedPartTab) 
    : 0;
  const currentProgram = exercises?.exercise_program?.[currentPartIndex];
  if (isPending) return <div className="p-4 text-center">파트 데이터를 불러오는 중...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">{error?.message}</div>;
  if (selectedExercise !== null) {
    return <ExerciseDetail exerciseId={selectedExercise} onBack={() => setSelectedExercise(null)} />;
  }
  return (
    <div className="flex flex-col gap-2">
      <span className="text-start px-2 text-sub-800 font-semibold">운동 프로그램 부위 선택</span>

      <div className="flex flex-wrap gap-2 px-2">
        {realRiskPartArray.map((partIdx) => {
          const isSelected = currentPartTab === partIdx;
          return (
            <span 
              key={partIdx} 
              onClick={() => setSelectedPartTab(partIdx)}
              className={`px-2.5 py-1 text-xs md:text-base text-sm rounded-full border transition-colors cursor-pointer font-medium
                ${isSelected 
                  ? "bg-accent border-accent text-white" 
                  : "bg-sub100 text-sub600 border-sub-200 hover:border-accent hover:text-accent"
                }
              `}
            >
              {partMap[partIdx] || "기타 부위"}
            </span>
          );
        })}
      </div>
      {currentProgram && (<ExerciseList programs={currentProgram} onSelect={setSelectedExercise} />)}
    </div>
  );
}