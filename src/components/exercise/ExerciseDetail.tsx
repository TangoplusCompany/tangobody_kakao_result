import { useEffect } from "react";
import { useGetExerciseDetail } from "../../hooks/useGetExerciseDetail";
import arrowLeft from "../../assets/ic_arrow_left.svg"
import { cn } from "../../lib/utils";
import { cardStyle } from "../../lib/styles";

export default function ExerciseDetail({ exerciseId, onBack }: { exerciseId: number; onBack: () => void }) {
  const params = new URLSearchParams(window.location.search);
  const t_r = params.get("t_r") || "";
  const { mutate, data: exercise, isPending, isError, error } = useGetExerciseDetail();

  useEffect(() => {
    if (t_r) {
      mutate({
        exercise_sn: exerciseId,
        t_r: t_r
      });
    }
  }, [t_r, mutate, exerciseId]);

  if (isPending || !exercise) return <div className="p-4 text-center">파트 데이터를 불러오는 중...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-2 md:gap-4 text-sub-800  p-4">
      <div className="w-fit rounded-xl px-0 md:px-2 py-1 flex gap-2 items-center cursor-pointer hover:bg-sub-150 transition-colors text-sm md:text-base" onClick={onBack}>
        <img src={arrowLeft} className="w-2 h-2 md:w-4 md:h-4"/>
        목록으로
      </div>

      <video
        src={exercise.video_filepath}
        controls
        className="w-full h-full object-cover"
      />

      <div className={cn(cardStyle, "flex flex-col gap-4 text-start p-2")}>
        <div className="font-bold md:text-xl text-base">
          {exercise.exercise_name}
        </div>

        <div className="flex flex-col gap-1 md:text-lg text-sm">
          <span>⏲️ {Math.floor(exercise.duration / 60)}분 {exercise.duration % 60}초</span>
          <span>📊 {exercise.exercise_stage}</span>
          <span>📅 {exercise.exercise_frequency} - {exercise.exercise_intensity}</span>
        </div>
        <div className="h-px w-full flex rounded-full bg-sub-200"/>
      
        <div className="md:text-lg font-bold">운동 소개</div>
        <span className="font-medium md:text-base text-sm">{exercise.related_symptom}</span>

        <div className="md:text-lg font-bold">운동 순서</div>
        <span className="font-medium md:text-base text-sm whitespace-pre-line leading-tight text-sub-600">
          {exercise.exercise_method}
        </span>

        <div className="md:text-lg font-bold">관련 근육</div>
        <span className="font-medium md:text-base text-sm">{exercise.related_muscle}</span>

        <div className="md:text-lg font-bold">관련 관절</div>
        <span className="font-medium md:text-base text-sm">{exercise.related_joint}</span>

        <div className="md:text-lg font-bold">주의 사항</div>
        <span className="font-medium md:text-base text-sm whitespace-pre-line pb-4 text-sub-600">{exercise.exercise_caution}</span>


      </div>
    </div>
  )
}