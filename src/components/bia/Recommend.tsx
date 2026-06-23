import type { IRecommend } from "@/types/bia";
import ic_nutrition from "@/assets/ic_nutrition.png"
import ic_exercise from "@/assets/ic_exercise.png"
import ic_habit from "@/assets/ic_habit.png"


export function RecommendCard ({type, title, description} : {type: string, title: string, description: string}) {
  const iconMap: Record<string, string> = {
    "영양처방": ic_nutrition,
    "운동처방": ic_exercise,
    "생활습관": ic_habit,
  };
  return (
    <div className="flex w-full gap-2">
      <div className="w-20 h-20 px-2 py-1 aspect-square rounded-[4px] bg-sub100 border items-center flex justify-center border-sub200">
        <img src={iconMap[type]} alt={type} className="w-12 h-12" />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex w-full justify-between items-center">
          <span className="text-sm font-bold text-blackk ">{title}</span>
          <div className="px-2 py-1 rounded-[4px] bg-accent text-xs text-white">{type}</div>
        </div>

        <div className="text-xs text-start leading-tight text-sub600">
          {description}
        </div>
      </div>

    </div>
  );
}


export default function Recommend({data}: {data: IRecommend}) {
  
  const types = [
    {
        type: "영양처방",
        title: data.result_nutrition_title,
        description: data.result_nutrition_description
    },
    {
        type: "운동처방",
        title: data.result_exercise_title,
        description: data.result_exercise_description
    },
    {
        type: "생활습관",
        title: data.result_habits_title,
        description: data.result_habits_description
    },

  ]
  return (
    <div className="flex flex-col gap-2 px-2 py-2 w-full h-full">
      {/* 1. 타이틀 영역 (작성하신 부분) */}
      <div className="flex gap-2 items-center text-accent font-bold">
        <div className="w-3 h-3 rounded-[3px] bg-accent" />
        <div className="text-accent font-bold text-sm ">
          체중조절/처방
        </div>
      </div>

      <div className="grid grid-rows-3 h-full gap-2">
        {types.map( (type) => (
          <RecommendCard key={type.title} type={type.type} title={type.title} description={type.description} />
        )

        )}
      </div>
      
      
    </div>
  );
}
