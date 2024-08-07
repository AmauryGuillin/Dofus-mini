import { ChatInfoMessage } from "@/types/chat-info-message";
import { Enemy } from "@/types/enemy";
import { Player } from "@/types/player";
import { generateBouftouBite } from "@/utils/gamedesign/enemy-attack-generator";
import { generatePression } from "@/utils/gamedesign/player-attack-generator";
import { useStore } from "./store";
import { useEntityActions } from "./useEntityActions";
import { useEntityActionsUtils } from "./useEntityActionsUtils";

export function useSelectCell(
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>
) {
  const { enemyAttack, playerAttack, playerBoost } =
    useEntityActions(setMessage);
  const {
    addErrorMessage,
    calculateDistance,
    calculatePath,
    handlePlayerMovementDirection,
  } = useEntityActionsUtils(setMessage);
  const player = useStore((state) => state.player);
  const setPlayerInfo = useStore((state) => state.setPlayerInfo);

  const enemy = useStore((state) => state.enemy);
  const setEnemyInfo = useStore((state) => state.setEnemyInfo);

  const setSelectedSpell = useStore((state) => state.setSelectedSpell);
  const setAttackRangeDisplay = useStore(
    (state) => state.setAttackRangeDisplay
  );

  const playerOnAttackMode = useStore((state) => state.playerOnAttackMode);
  const setPlayerOnAttackMode = useStore(
    (state) => state.setPlayerOnAttackMode
  );

  const boostDuration = useStore((state) => state.boostDuration);

  const canMove = useStore((state) => state.canMove);
  const setCanMove = useStore((state) => state.setCanMove);

  const path = useStore((state) => state.path);
  const setPath = useStore((state) => state.setPath);

  function selectCell(key: string, currentPlayer: Player | Enemy) {
    if (!player.position || !enemy.position) return;

    let newPath: string[];

    if (player.isTurnToPlay) {
      if (key === enemy.position) {
        if (!playerOnAttackMode) return;
        const distance = calculateDistance(player.position, enemy.position);
        const pression = generatePression();
        if (distance <= pression.range) {
          if (enemy.pv > 0) {
            setCanMove(false);
            playerAttack();
            setPlayerOnAttackMode(false);
            return;
          }
        } else {
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
          setPlayerOnAttackMode(false);
          addErrorMessage(`La cible est hors de portée`);
        }
        return;
      }

      if (key === player.position) {
        if (boostDuration !== undefined) {
          addErrorMessage("Action impossible");
          return;
        }
        playerBoost();
        setSelectedSpell(null);
        return;
      }
      newPath = calculatePath(
        player.position!,
        key,
        currentPlayer.pm,
        enemy.position
      );
    } else {
      if (key === player.position) {
        const distance = calculateDistance(enemy.position, player.position);
        const bouftouBite = generateBouftouBite();
        if (distance <= bouftouBite.range) {
          if (player.pv > 0) {
            enemyAttack();
            return;
          }
        } else {
          addErrorMessage(`La cible est hors de portée`);
        }
        return;
      }
      newPath = calculatePath(
        enemy.position!,
        key,
        currentPlayer.pm,
        player.position
      );
    }

    if (!canMove) {
      setSelectedSpell(null);
      setAttackRangeDisplay([]);
      setPlayerOnAttackMode(false);
      return;
    }

    if (playerOnAttackMode) {
      setSelectedSpell(null);
      setAttackRangeDisplay([]);
      setPlayerOnAttackMode(false);
      return;
    }

    if (newPath.length - 1 <= currentPlayer.pm) {
      if (player.isTurnToPlay) {
        moveEntity(path);

        setPlayerInfo("pm", player.pm - (newPath.length - 1));
      } else {
        setEnemyInfo("position", key);
        setEnemyInfo("pm", enemy.pm - (newPath.length - 1));
      }

      setPath([]);
    } else {
      addErrorMessage(`Action impossible`);
    }
  }

  function determineEntityOrientation(
    cell: string,
    path: string[],
    count: number
  ) {
    const position = handlePlayerMovementDirection(cell, path[count + 1]);
    switch (position) {
      case "up":
        setPlayerInfo("isIllustrationReverted", true);
        setPlayerInfo("isIllustrationPositionCorrectedUp", true);
        setPlayerInfo("isIllustrationPositionCorrectedDown", false);
        setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
        setPlayerInfo("illustration", "./player-static/player-static-left.png");
        break;
      case "down":
        setPlayerInfo("isIllustrationReverted", true);
        setPlayerInfo("isIllustrationPositionCorrectedUp", false);
        setPlayerInfo("isIllustrationPositionCorrectedDown", true);
        setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
        setPlayerInfo(
          "illustration",
          "./player-static/player-static-front-right.png"
        );
        break;
      case "left":
        setPlayerInfo("isIllustrationReverted", false);
        setPlayerInfo("isIllustrationPositionCorrectedUp", false);
        setPlayerInfo("isIllustrationPositionCorrectedDown", false);
        setPlayerInfo("isIllustrationPositionCorrectedLeft", true);
        setPlayerInfo("illustration", "./player-static/player-static-left.png");
        break;
      case "right":
        setPlayerInfo("isIllustrationReverted", false);
        setPlayerInfo("isIllustrationPositionCorrectedUp", false);
        setPlayerInfo("isIllustrationPositionCorrectedDown", false);
        setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
        setPlayerInfo(
          "illustration",
          "./player-static/player-static-front-right.png"
        );
        break;
      default:
        console.log("nothing to do");
        break;
    }
  }

  async function moveEntity(path: string[]) {
    let count = 0;
    for (const cell of path) {
      setPlayerInfo("position", cell);
      determineEntityOrientation(cell, path, count);
      count++;
      await new Promise((resolve) => setTimeout(resolve, 187.5)); //187.5
    }
  }

  return { selectCell };
}
