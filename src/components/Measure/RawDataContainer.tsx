import React from "react";
import type { IRawDataUnit } from "../../types/basic";
import RawData from "./RawData";

export default function RawDataContainer ({rawData}: {rawData: IRawDataUnit[]}) {

  const sortedData = React.useMemo(() => {
    const order = ['코', '머리', '어깨', '팔꿈치', '몸', '정면', '골반', '무릎', '발목'];
    
    return [...rawData].sort((a, b) => {
      const aUnit = a.measure_unit ?? '';
      const bUnit = b.measure_unit ?? '';
      
      const aOrderIndex = order.findIndex(word => aUnit.includes(word));
      const bOrderIndex = order.findIndex(word => bUnit.includes(word));
      
      if (aOrderIndex !== -1 && bOrderIndex !== -1) {
        if (aOrderIndex !== bOrderIndex) {
          return aOrderIndex - bOrderIndex;
        }
        return aUnit.localeCompare(bUnit, 'ko');
      }
      
      if (aOrderIndex !== -1) return -1;
      if (bOrderIndex !== -1) return 1;
      
      return aUnit.localeCompare(bUnit, 'ko');
    });
  }, [rawData]);
  
  return (
    <div className="flex flex-col m-2 gap-4 ">
      {(() => {
        const grouped: (IRawDataUnit | [IRawDataUnit, IRawDataUnit])[] = [];
        const processed = new Set<number>();

        sortedData.forEach((data, idx) => {
          if (processed.has(idx)) return;

          const sameUnit = sortedData.filter(
            (d, i) => i > idx && d.measure_unit === data.measure_unit && !processed.has(i)
          );

          if (sameUnit.length === 0) {
            grouped.push(data);
            processed.add(idx);
          } else if (sameUnit.length === 1) {
            grouped.push([data, sameUnit[0]]);
            processed.add(idx);
            processed.add(sortedData.indexOf(sameUnit[0]));
          } else {
            const pair = sameUnit.find(d => d.measure_type === data.measure_type);
            if (pair) {
              grouped.push([data, pair]);
              processed.add(idx);
              processed.add(sortedData.indexOf(pair));
            } else {
              grouped.push(data);
              processed.add(idx);
            }
          }
        });
        
        return grouped.map((data, idx) => (
          <RawData key={idx} data={data}  />
        ));
      })()}
    </div>
  );
}