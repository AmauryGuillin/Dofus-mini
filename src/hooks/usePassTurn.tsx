import { playAudio } from "@/utils/music/handleAudio";
import { useState } from "react";
import { useStore } from "./store";

export function usePassTurn() {
  const turnCount = useStore((state) => state.turnCount);
  const setTurnCount = useStore((state) => state.setTurnCount);
  const setSelectedSpell = useStore((state) => state.setSelectedSpell);
  const player = useStore((state) => state.player);
  const setPlayerInfo = useStore((state) => state.setPlayerInfo);

  const enemy = useStore((state) => state.enemy);
  const setEnemyInfo = useStore((state) => state.setEnemyInfo);

  const boostDuration = useStore((state) => state.boostDuration);
  const setBoostDuration = useStore((state) => state.setBoostDuration);

  const [isUserImageDisplayed, setIsUserImageDisplayed] =
    useState<boolean>(false);

  function passTurn(entity: string) {
    setSelectedSpell(null);
    if (entity === player.name) {
      player.pm = 3;
      player.pa = 6;
      setEnemyInfo("isTurnToPlay", true);
      setPlayerInfo("isTurnToPlay", false);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
    }
    if (entity === enemy.name) {
      if (boostDuration !== undefined) {
        setBoostDuration(boostDuration - 1);
        if (boostDuration === 1) {
          setBoostDuration(undefined);
        }
      }
      setTurnCount(turnCount + 1);
      enemy.pm = 3;
      enemy.pa = 6;
      const audioSource = "./200_fx_69.mp3.mp3";
      playAudio(audioSource, 0.5, false, true);
      setEnemyInfo("isTurnToPlay", false);
      setPlayerInfo("isTurnToPlay", true);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
    }
  } //usePassTurn

  return { isUserImageDisplayed, passTurn };
}
