import { cn } from "@/lib/utils";
import type { GaitContainerProps } from "./Container";

export interface GaitInfoCardProps {
  type: string//"Pattern" | "Balance" | "Efficiency"
  title ?: string;
  description ?: string;
  grade: number;
}
export function GaitInfoHorizonCard({ type, title,  grade } : GaitInfoCardProps) {
  const borderColor = {
    0 : " border-sub200",
    1 : "border-orange-600",
    2: "border-red-600"
  } [grade];
  const textColor = {
    0 : "text-sub750",
    1 : "text-orange-600",
    2: "text-red-600"
  } [grade];
  const typeTitle = {
    "Pattern" : "보행 패턴",
    "Balance" : "동적 균형",
    "Efficiency": "보행 효율"
  } [type];
  return (
    <div className={`flex flex-col p-2 rounded-xl items-center border ${borderColor}`}>
      <div className={` text-xs sm:text-sm `}>{typeTitle}</div>
      <div className={`text-sm sm:text-base ${textColor}`}>{title}</div>
    </div>
  )
}

export function GaitInfoVertiCard({ type, description, grade } : GaitInfoCardProps) {

  const textBg = {
    0: "bg-sub600 dark:bg-gray-600",
    1: "bg-orange-600",
    2: "bg-red-600",
  } [grade];
  const typeTitle = {
    "TotalComment" : "종합 요약",
    "Rhythm" : "리듬 및 속도",
    "FallRisk": "자세 및 낙상 지표",
    "RecommendComment": "추천"
  } [type];

  const gradeTitle = {
    0 : "정상",
    1 : "주의",
    2: "위험",
  } [grade];

  return (
    <div className={`flex flex-col gap-2 `}>
      <div className="flex w-full justify-between">
        <div className={` text-sm sm:text-base font-semibold`}>{typeTitle}</div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs text-white text-center whitespace-normal break-keep",
          textBg,
        )}>{gradeTitle}</div>
      </div>
      <div className={`text-sm sm:text-base text-sub700`}>{description}</div>
    </div>
  )
}



export default function GaitInfo({data}: GaitContainerProps) {
  const iData = data.gait_measure_info
  const infoHorizonCards = [
    {
      type: "Pattern",
      title: iData.resultGaitPatternDescription,
      description: iData.resultGaitPatternDescription,
      grade: iData.resultGaitPatternGrade
    },
    {
      type: "Balance",
      title: iData.resultGaitBalanceDescription,
      description: iData.resultGaitBalanceDescription,
      grade: iData.resultGaitBalanceGrade
    },
    {
      type: "Efficiency",
      title: iData.resultGaitEfficiencyDescription,
      description: iData.resultGaitEfficiencyDescription,
      grade: iData.resultGaitEfficiencyGrade
    }
  ]

  const infoVertiCards = [
    {
      type: "TotalComment",
      description: iData.resultGaitTotalCommentDescription,
      grade: iData.resultGaitTotalCommentGrade
    },
    {
      type: "Rhythm",
      description: iData.resultGaitRhythmDescription,
      grade: iData.resultGaitRhythmGrade
    },
    {
      type: "FallRisk",
      description: iData.resultFallRiskDescription,
      grade: iData.resultFallRiskGrade
    },
    {
      type: "RecommendComment",
      description: iData.resultRecommendCommentDescription,
      grade: iData.resultRecommendCommentGrade
    }
  ]
  return (
    <div className="flex flex-col rounded-3xl border-2 border-sub200 p-4">
      <div className="text-lg font-semibold mb-2 text-sub700">
        전체 보행 결과 
      </div>
      <div className="flex items-center gap-2 ">
        <div className="w-3 h-3 rounded-sm bg-mainBlue-300" />
        <div className="text-mainBlue-300 text-sm sm:text-base font-bold ">
          보행 패턴
        </div>
      </div>
      <div className="relative w-full text-center font-semibold text-sub700 text-base sm:text-lg py-2">{iData.resultGaitTypeTitle}</div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {infoHorizonCards.map((card, id) => (
          <GaitInfoHorizonCard key={id} type={card.type} title={card.title} grade={card.grade} />
        ))}
      </div>


      <div className="flex items-center gap-2 ">
        <div className="w-3 h-3 rounded-sm bg-mainBlue-300" />
        <div className="text-mainBlue-300 text-sm sm:text-base font-bold ">
          설명
        </div>
      </div>
      <div className="grid grid-rows-4 h-full gap-2 mt-4">
         {infoVertiCards.map((card, id) => (
            <GaitInfoVertiCard key={id} type={card.type} description={card.description} grade={card.grade} />
          ))}
      </div>
    </div>
  )
};