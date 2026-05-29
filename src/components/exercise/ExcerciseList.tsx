import type { IProgram } from "../../types/exercise";
import timer from "../../assets/ic_timer.svg";
import playCircle from "../../assets/ic_play_circle.svg";

export default function ExerciseList({ programs, onSelect }: { programs: IProgram; onSelect: (id: number) => void }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col text-start m-4">
        <span className="font-bold md:text-xl text-base text-sub-800">{programs.exercise_program_title}</span>
        <span className="text-sub-800 md:text-lg text-sm">{programs.exercise_program_description}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:m-0 m-4">
        {programs.exercise_list.map((exercise, idx) => {
          return (
            <div className="group flex flex-col md:grid md:grid-cols-2 py-4 gap-4 rounded-3xl border border-sub-200 p-4 shadow-lg cursor-pointer 
              transition-all duration-200 ease-in-out
              hover:-translate-y-1 hover:shadow-xl
              active:translate-y-0.5 active:scale-[0.99] active:shadow-lg"
              onClick={() => {onSelect(exercise.exercise_id)}}
              key={idx}>
              <div className="relative w-full md:w-fit h-fit rounded-xl overflow-hidden cursor-pointer">
                <img 
                  src={exercise.image_filepath} 
                  className="w-full md:w-auto h-52 md:h-75 object-cover"
                  alt={exercise.exercise_name}
                />

                
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <img 
                    src={playCircle}
                    className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-200" 
                    alt="재생하기"
                  />
                </div>

                <span className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full md:text-base text-sm bg-sub-800/90 text-white px-2.5 py-1 backdrop-blur-sm shadow-md pointer-events-none">
                  <img src={timer} className="w-4 h-4" alt="타이머" />
                  {Math.floor(exercise.duration / 60)}분 {exercise.duration % 60}초
                </span>

              </div>
              
              <div className="flex flex-col text-start gap-2 md:gap-4">
                <span className="text-base md:text-xl text-sub-800 font-bold">{exercise.exercise_name}</span>
                
                <span className="text-sm md:text-lg text-sub-800">{exercise.related_symptom}</span>
              </div>
              
            </div>
          )
        })}
      </div>
    </div>
  )
}