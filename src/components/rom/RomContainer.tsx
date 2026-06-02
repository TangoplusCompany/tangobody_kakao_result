import { useEffect,  useState } from "react";
import { usePostRomData } from "../../hooks/rom/usePostRom";
import { Shimmer } from "../ui/Shimmer";
import type { IRomDetail } from "../../types/rom";
import RomDetail from "./RomDetail";
import { transformToRomPairs } from "@/util/romMapper";
import { RomListItem } from "./RomListItem";

const JOINT_KEYWORDS = ["목", "어깨", "팔꿉", "엉덩", "무릎", "발목"];

export default function RomContainer() {
  const params = new URLSearchParams(window.location.search);
  const t_r = params.get("t_r") || "";
  const { mutate, pairedData, isPending, isError } = usePostRomData();


  const [selectedRomPair, setSelectedRomPair] = useState<number[] | undefined>();
  useEffect(() => {
    if (t_r) {
      mutate(t_r);
    }
  }, [mutate, t_r]);

  const handleItemClick = (clickedSn: number) => {
    const allPairs = transformToRomPairs(pairedData);
    const matchedPair = allPairs.find(
      (pair) => pair.left?.sn === clickedSn || pair.right?.sn === clickedSn
    );

    if (matchedPair) {
      const sns: number[] = [];
      if (matchedPair.left) sns.push(matchedPair.left.sn);
      if (matchedPair.right) sns.push(matchedPair.right.sn);
      setSelectedRomPair(sns); 
    }
  };

  const groupedData = pairedData.reduce<Record<string, IRomDetail[]>>((acc, item) => {
    const joint = JOINT_KEYWORDS.find((keyword) => item.title.includes(keyword)) || "기타";
    if (!acc[joint]) acc[joint] = [];
    acc[joint].push(item);
    return acc;
  }, {});

  const sortedGroupedData = Object.entries(groupedData).sort(([jointA], [jointB]) => {
    const indexA = JOINT_KEYWORDS.indexOf(jointA);
    const indexB = JOINT_KEYWORDS.indexOf(jointB);
    const finalIndexA = indexA === -1 ? 999 : indexA;
    const finalIndexB = indexB === -1 ? 999 : indexB;
    return finalIndexA - finalIndexB;
  });

  if (isPending) return (
    <div className="flex flex-col p-2 gap-4">
      <div className="grid grid-cols gap-2">
        <Shimmer className="h-40 md:h-40 rounded-xl"/>
        <Shimmer className="h-40 md:h-40 rounded-xl"/>
      </div>
      <div className="p-2 rounded-xl border border-sub-200"><Shimmer className="h-40 md:h-50 rounded-xl"/></div>
      <div className="p-2 rounded-xl border border-sub-200"><Shimmer className="h-20 md:h-50 rounded-xl"/></div>
      <div className="p-2 rounded-xl border border-sub-200"><Shimmer className="h-20 md:h-50 rounded-xl"/></div>
    </div>
  );
  if (isError) return <div className="p-4 text-center text-red-500">{isError}</div>;

  
  return (
    <div className="flex flex-col bg-sub-100 gap-4 pb-8 md:pb-16">
      {!selectedRomPair && (<div className="font-bold text-base text-sub-800 text-start px-4 py-2">관절가동범위 검사 목록</div>)}
      {!selectedRomPair && sortedGroupedData.map(([jointName, items]) => {
        const pairedItems = transformToRomPairs(items);

        return (
          <div key={jointName} className="flex flex-col overflow-hidden ">
            
            {/* 관절 이름 (헤더) */}
            <div className="text-start text-lg md:text-xl font-bold text-sub-700 mx-4 py-2 border-b border-sub-400">
              {jointName}
            </div>
            
            {/* 내부 아이템 리스트: md 이상일 때 좌우 2열 배치 */}
            {/* 💡 grid grid-cols-1 md:grid-cols-2 구조를 주어 반응형 레이아웃을 잡습니다. */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-sub-200 gap-2 mx-4 mt-4">
              {pairedItems.map((pair) => {
                const subItems = [pair.left, pair.right].filter(Boolean) as IRomDetail[];

                return subItems.map((item) => (
                  <RomListItem 
                    key={item.sn} 
                    item={item} 
                    onClick={handleItemClick} 
                  />
                ));
              })}
            </div>

          </div>
        );
      })}
      {selectedRomPair && (() => {
        const selectedItems = pairedData.filter((origin) => selectedRomPair.includes(origin.sn));
        const isFirstRight = selectedItems[0]?.title.includes("오른");
        const leftItem = isFirstRight ? selectedItems[1] : selectedItems[0];
        const rightItem = isFirstRight ? selectedItems[0] : selectedItems[1];
        
        return (
          <RomDetail 
            left={leftItem}   
            right={rightItem}
            onBack={() => setSelectedRomPair(undefined)}  
          />
        );
      })()}
    </div>
  )
}