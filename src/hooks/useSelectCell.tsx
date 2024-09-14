import { ChatInfoMessage } from "@/types/chat-info-message";
import { Enemy } from "@/types/enemy";
import { Player } from "@/types/player";
import { generateBouftouBite } from "@/utils/gamedesign/enemy-attack-generator";
import { generatePression } from "@/utils/gamedesign/player-attack-generator";
import { playErrorSound } from "@/utils/music/handleAudio";
import { useStore } from "./store";
import { useEntityActions } from "./useEntityActions";
import { useEntityActionsUtils } from "./useEntityActionsUtils";

export function useSelectCell(
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>
) {
  const {
    enemyAttack,
    playerAttack,
    playerBoost,
    animationUp,
    animationDown,
    animationLeft,
    animationRight,
  } = useEntityActions(setMessage);

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
            return;
          }
        } else {
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
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
      if (path.length === 0) return;
      // if (player.isTurnToPlay) {
      //   setPlayerInfo("pm", player.pm - (newPath.length - 1));
      // } else {
      //   setEnemyInfo("pm", enemy.pm - (newPath.length - 1));
      // }

      moveEntity(path, currentPlayer);

      setPath([]);
    } else {
      addErrorMessage(`Action impossible`);
      playErrorSound(0.5);
    }
  }

  //TODO: Refactor :)
  function determinePlayerOrientation(
    cell: string,
    path: string[],
    count: number
  ) {
    const position = handlePlayerMovementDirection(cell, path[count + 1]);
    switch (position) {
      case "up":
        animationUp(player);
        setPlayerInfo("orientation", "up");
        setPlayerInfo("illustration", "./player-static/player-static-left.png");
        break;
      case "down":
        animationDown(player);
        setPlayerInfo("orientation", "down");
        setPlayerInfo(
          "illustration",
          "./player-static/player-static-front-right.png"
        );
        break;
      case "left":
        animationLeft(player);
        setPlayerInfo("orientation", "left");
        setPlayerInfo("illustration", "./player-static/player-static-left.png");
        break;
      case "right":
        animationRight(player);
        setPlayerInfo("orientation", "right");
        setPlayerInfo(
          "illustration",
          "./player-static/player-static-front-right.png"
        );
        break;
      default:
        break;
    }
  }

  //TODO: Refactor :)
  function determineEnemyOrientation(
    cell: string,
    path: string[],
    count: number
  ) {
    const position = handlePlayerMovementDirection(cell, path[count + 1]);
    switch (position) {
      case "up":
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ up");
        animationUp(enemy);
        setEnemyInfo("orientation", "up");
        setEnemyInfo("illustration", "./enemy-static/bouftou-left.png");
        break;
      case "down":
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ down");
        animationDown(enemy);
        setEnemyInfo("orientation", "down");
        setEnemyInfo("illustration", "./enemy-static/bouftou.png");
        break;
      case "left":
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ left");
        animationLeft(enemy);
        setEnemyInfo("orientation", "left");
        setEnemyInfo("illustration", "./enemy-static/bouftou-left.png");
        break;
      case "right":
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ right");
        animationRight(enemy);
        setEnemyInfo("orientation", "right");
        setEnemyInfo("illustration", "./enemy-static/bouftou.png");
        break;
      default:
        break;
    }
  }

  async function moveEntity(path: string[], entity: Player | Enemy) {
    console.log("MOVE ENTITY FUNCTION");
    console.log("path", path);
    console.log("entity", entity);
    if (path.length === 0) return;
    if (entity.type === "Player") {
      setPlayerInfo("isMoving", true);
      let count = 0;
      for (const cell of path) {
        setPlayerInfo("position", cell);
        determinePlayerOrientation(cell, path, count);
        setPlayerInfo("pm", player.pm - (path.length - 1));
        setPlayerInfo("position", cell);
        count++;
        await new Promise((resolve) => setTimeout(resolve, 187.5));
      }
      setPlayerInfo("isMoving", false);
    } else if (entity.type === "Enemy") {
      setEnemyInfo("isMoving", true);
      let count = 0;
      for (const cell of path) {
        setEnemyInfo("position", cell);
        determineEnemyOrientation(cell, path, count);
        setEnemyInfo("pm", enemy.pm - (path.length - 1));
        setEnemyInfo("position", cell);
        count++;
        await new Promise((resolve) => setTimeout(resolve, 187.5));
      }
      setEnemyInfo("isMoving", false);
    }
  }

  async function enemyIA() {
    //Détermine la case à cibler pour le bouftou
    console.log(1, "determine la case à cibler pour le bouftou");
    const targetPosition = await new Promise<string>((resolve) => {
      resolve(determineEnemyTargetPosition());
    });

    //Calcul de la distance et attribution du path
    console.log(2, "calcul de la distance et attribution du path");
    const distance = await new Promise<string[]>((resolve) => {
      console.log("calcul du path");
      const distance = calculatePath(
        enemy.position,
        targetPosition,
        20,
        player.position
      );
      console.log("distance", distance);
      const distanceCalculated = distance.slice(
        0,
        useStore.getState().enemy.pm + 1
      );
      console.log(distanceCalculated);
      resolve(distanceCalculated);
    });
    useStore.getState().setPath(distance);
    console.log("fin du calcul de la distance");

    //Déplacement automatique
    console.log(3, "déplacement automatique");
    console.log("déplacement en cours");
    useStore.getState().setCanMove(true);
    await new Promise((resolve) => {
      console.log("canMove ==> ", useStore.getState().canMove);
      setTimeout(() => {
        resolve(
          moveEntity(useStore.getState().path, useStore.getState().enemy)
        );
      }, 100);
    });
    useStore.getState().setCanMove(false);
    console.log("canMove ==> ", useStore.getState().canMove);
    console.log("déplacement terminé");

    //Détermine si l'enemie est à côté du joueur
    console.log(4, "détermine si l'enemie est à côté du joueur");
    console.log(
      "début du calcul de la position de l'énemie par rapport au joueur"
    );

    const isNextToPlayer = await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(determineIfEnemyIsNextToPlayer());
      }, 500);
    });
    console.log(
      "fin du calcul de la position de l'énemie par rapport au joueur"
    );

    if (isNextToPlayer) {
      console.log(4.5, "doit attaquer ?");
      console.log("doit attaquer");
      await new Promise((resolve) => {
        enemyAttack();
        resolve(true);
      });
    }
    console.log(5, "fin du process");
  }

  async function determineEnemyTargetPosition(): Promise<string> {
    const playerPosition = useStore.getState().player.position;
    const path = calculatePath(
      playerPosition,
      useStore.getState().enemy.position,
      20,
      playerPosition
    );
    const enemyTarget = path[1];
    return enemyTarget;
  }

  function determineIfEnemyIsNextToPlayer(): boolean {
    const enemyPosition = useStore.getState().enemy.position;
    const playerPosition = useStore.getState().player.position;
    const maxLength = 20;

    console.log("enemyPosition", enemyPosition);
    console.log("playerPosition", playerPosition);

    const path = calculatePath(
      enemyPosition,
      playerPosition,
      maxLength,
      enemyPosition
    );

    console.log("path", path);

    if (path.length > 2) {
      console.log("Le joueur n'est pas à côté");
      return false;
    }

    if (path.length === 2) {
      console.log("Le joueur est à côté");
      return true;
    }

    return false;
  }

  return { selectCell, enemyIA };
}
