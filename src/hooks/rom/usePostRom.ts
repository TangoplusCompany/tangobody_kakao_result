import { useMutation } from "@tanstack/react-query";
import { postROMData } from "../../services/postRom";
// import { transformToRomPairs } from "../../util/romMapper";

export const usePostRomData = () => {
  const mutation = useMutation({
    mutationFn: postROMData,
  });

  // mutation.data가 변경되면 자동으로 pairedData가 계산됨
  const pairedData = mutation.data ? mutation.data : [];

  return {
    ...mutation,
    pairedData,
  };
};