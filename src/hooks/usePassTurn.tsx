import { ChatInfoMessage } from "@/types/chat-info-message";
import { playAudio } from "@/utils/music/handleAudio";
import { useState } from "react";
import { useStore } from "./store";
import { useSelectCell } from "./useSelectCell";

export function usePassTurn(
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>
) {
  const turnCount = useStore((state) => state.turnCount);
  const setTurnCount = useStore((state) => state.setTurnCount);
  const setSelectedSpell = useStore((state) => state.setSelectedSpell);
  const player = useStore((state) => state.player);
  const setPlayerInfo = useStore((state) => state.setPlayerInfo);

  const enemy = useStore((state) => state.enemy);
  const setEnemyInfo = useStore((state) => state.setEnemyInfo);

  const setBoostDuration = useStore((state) => state.setBoostDuration);

  const [isUserImageDisplayed, setIsUserImageDisplayed] =
    useState<boolean>(false);

  const { enemyIA } = useSelectCell(setMessage);

  async function passTurn(entity: string) {
    if (entity === player.name) {
      await playerRestoration();
      await new Promise((resolve) => {
        resolve(enemyIA());
      });
      await new Promise((resolve) => {
        setTimeout(() => {
          enemyPassTurn();
          resolve(true);
        }, 700);
      });
    }
    if (entity === enemy.name) {
      useStore.getState().path = [];
      if (useStore.getState().boostDuration !== undefined) {
        setBoostDuration(useStore.getState().boostDuration! - 1);
        if (useStore.getState().boostDuration === 0) {
          setBoostDuration(undefined);
        }
      }
      if (useStore.getState().player.bondCooldown !== null) {
        setPlayerInfo(
          "bondCooldown",
          useStore.getState().player.bondCooldown! - 1
        );
        if (useStore.getState().player.bondCooldown === 0) {
          setPlayerInfo("bondCooldown", null);
        }
      }
      setTurnCount(turnCount + 1);
      useStore.getState().enemy.pm = useStore.getState().enemy.pmMax;
      useStore.getState().enemy.pa = useStore.getState().enemy.paMax;
      const audioSource = "./200_fx_69.mp3.mp3";
      playAudio(audioSource, 0.5, false, true);
      setEnemyInfo("isTurnToPlay", false);
      setPlayerInfo("isTurnToPlay", true);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
    }
  }

  function enemyPassTurn() {
    passTurn(useStore.getState().enemy.name);
  }

  function playerRestoration() {
    const result = new Promise((resolve) => {
      setSelectedSpell(null);
      player.pm = player.pmMax;
      player.pa = player.paMax;
      setEnemyInfo("isTurnToPlay", true);
      setPlayerInfo("isTurnToPlay", false);
      setIsUserImageDisplayed(true);
      setTimeout(() => {
        setIsUserImageDisplayed(false);
      }, 2000);
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
    return result;
  }

  return { isUserImageDisplayed, passTurn };
}
