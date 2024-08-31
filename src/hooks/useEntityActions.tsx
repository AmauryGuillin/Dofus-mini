import { ChatInfoMessage } from "@/types/chat-info-message";
import { Enemy } from "@/types/enemy";
import { Player } from "@/types/player";
import { generateBouftouBite } from "@/utils/gamedesign/enemy-attack-generator";
import { generatePression } from "@/utils/gamedesign/player-attack-generator";
import { generateCompulsion } from "@/utils/gamedesign/player-boost-generator";
import { playAudio, playErrorSound } from "@/utils/music/handleAudio";
import { getRandomInt } from "@/utils/tools/getRandomNumber";
import { useState } from "react";
import { useStore } from "./store";
import { useEntityActionsUtils } from "./useEntityActionsUtils";

export function useEntityActions(
  setMessage: React.Dispatch<React.SetStateAction<ChatInfoMessage[]>>
) {
  const setIsGameOver = useStore((state) => state.setIsGameOver);
  const setIsGameWin = useStore((state) => state.setIsGameWin);
  const player = useStore((state) => state.player);
  const setPlayerInfo = useStore((state) => state.setPlayerInfo);

  const enemy = useStore((state) => state.enemy);
  const setEnemyInfo = useStore((state) => state.setEnemyInfo);

  const selectedSpell = useStore((state) => state.selectedSpell);
  const setSelectedSpell = useStore((state) => state.setSelectedSpell);

  const setAttackRangeDisplay = useStore(
    (state) => state.setAttackRangeDisplay
  );

  const boostDuration = useStore((state) => state.boostDuration);
  const setBoostDuration = useStore((state) => state.setBoostDuration);
  const [playerBoostAmont, setPlayerBoostAmont] = useState<number>(0);

  const setPlayerOnAttackMode = useStore(
    (state) => state.setPlayerOnAttackMode
  );

  const {
    calculateEnemyPositionComparedToPlayer,
    calculateDistance,
    addErrorMessage,
    addInfoMessage,
  } = useEntityActionsUtils(setMessage);

  function enemyAttack() {
    if (enemy.pa <= 0) return;

    const bouftouBite = generateBouftouBite();

    if (enemy.pa < bouftouBite.cost) return;

    const distance = calculateDistance(enemy.position, player.position);

    if (distance > bouftouBite.range) {
      addErrorMessage(`La cible est hors de portée`);
    }

    const audio1 = "./enemy-sound-effects/142_fx_741.mp3.mp3";
    const audio2 = "./enemy-sound-effects/143_fx_740.mp3.mp3";
    const effects = [audio1, audio2];
    const playerDamage = "./player-sound-effects/damage/131_fx_751.mp3.mp3";
    const playerDeath1 = "./player-sound-effects/death/317_fx_584.mp3.mp3";
    const playerDeath2 = "./player-sound-effects/death/316_fx_585.mp3.mp3";

    setPlayerInfo("pv", (player.pv -= bouftouBite.damage!));
    setPlayerInfo("damageTaken", bouftouBite.damage!);

    setTimeout(() => {
      setPlayerInfo("damageTaken", null);
    }, 1100);

    const playerInitialImage = player.illustration;

    const playerPosition = calculateEnemyPositionComparedToPlayer(
      player.position,
      enemy.position
    );

    setPlayerInfo("isAttacked", true);

    if (player.pv <= 0) {
      setPlayerInfo("isDead", true);
      switch (player.orientation) {
        case "up":
          animationUp(player);
          setPlayerInfo(
            "illustration",
            "./player-animations/death-animation-left.gif"
          );
          break;
        case "down":
          animationDown(player);
          setPlayerInfo(
            "illustration",
            "./player-animations/death-animation.gif"
          );
          break;
        case "left":
          animationLeft(player);
          setPlayerInfo(
            "illustration",
            "./player-animations/death-animation-left.gif"
          );
          break;
        case "right":
          animationRight(player);
          setPlayerInfo(
            "illustration",
            "./player-animations/death-animation.gif"
          );
          break;
        default:
          break;
      }
      playAudio(effects[getRandomInt(effects.length)], 0.2, false, true);
      playAudio(playerDeath1, 0.2, false, true);
      setTimeout(() => {
        playAudio(playerDeath2, 0.1, false, true);
      }, 500);
      setTimeout(() => {
        setIsGameOver(true);
      }, 1150);
      return;
    }

    switch (player.orientation) {
      case "up":
        setEnemyInfo("orientation", "up");
        animationUp(player);
        setPlayerInfo(
          "illustration",
          "./player-animations/hit-animation-left.gif"
        );
        setTimeout(() => {
          setPlayerInfo("illustration", playerInitialImage);
          setPlayerInfo("isAttacked", false);
        }, 250);
        break;
      case "down":
        setEnemyInfo("orientation", "down");
        animationDown(player);
        setPlayerInfo("illustration", "./player-animations/hit-animation.gif");
        setTimeout(() => {
          setPlayerInfo("illustration", playerInitialImage);
          setPlayerInfo("isAttacked", false);
        }, 250);
        break;
      case "right":
        setEnemyInfo("orientation", "right");
        animationRight(player);
        setPlayerInfo("illustration", "./player-animations/hit-animation.gif");
        setTimeout(() => {
          setPlayerInfo("illustration", playerInitialImage);
          setPlayerInfo("isAttacked", false);
        }, 250);
        break;
      case "left":
        setEnemyInfo("orientation", "left");
        animationLeft(player);
        setPlayerInfo(
          "illustration",
          "./player-animations/hit-animation-left.gif"
        );
        setTimeout(() => {
          setPlayerInfo("illustration", playerInitialImage);
          setPlayerInfo("isAttacked", false);
        }, 250);
        break;
      default:
        break;
    }

    setEnemyInfo("isAttackAnimated", true);

    switch (playerPosition) {
      case "up":
        animationUp(enemy);
        setEnemyInfo(
          "illustration",
          "./enemy-animations/bouftou-attack-left.gif"
        );

        setTimeout(() => {
          setEnemyInfo("illustration", "./enemy-static/bouftou-left.png");
          setEnemyInfo("isAttackAnimated", false);
        }, 2000);
        break;
      case "down":
        animationDown(enemy);
        setEnemyInfo("illustration", "./enemy-animations/bouftou-attack.gif");

        setTimeout(() => {
          setEnemyInfo("illustration", "./enemy-static/bouftou.png");
          setEnemyInfo("isAttackAnimated", false);
        }, 2000);
        break;
      case "right":
        animationRight(enemy);
        setEnemyInfo("illustration", "./enemy-animations/bouftou-attack.gif");

        setTimeout(() => {
          setEnemyInfo("illustration", "./enemy-static/bouftou.png");
          setEnemyInfo("isAttackAnimated", false);
        }, 2000);
        break;
      case "left":
        animationLeft(enemy);
        setEnemyInfo(
          "illustration",
          "./enemy-animations/bouftou-attack-left.gif"
        );

        setTimeout(() => {
          setEnemyInfo("illustration", "./enemy-static/bouftou-left.png");
          setEnemyInfo("isAttackAnimated", false);
        }, 2000);
        break;
      default:
        break;
    }

    setTimeout(() => {
      playAudio(effects[getRandomInt(effects.length)], 0.2, false, true);
    }, 100);
    setTimeout(() => {
      playAudio(playerDamage, 0.2, false, true);
    }, 200);

    addInfoMessage(`${enemy.name} lance ${bouftouBite.attackName}.`);
    addInfoMessage(
      `${enemy.name} inflige ${bouftouBite.damage!} points de dommage à ${
        player.name
      }.`
    );

    setEnemyInfo("pa", (enemy.pa -= bouftouBite.cost));
  }

  function playerAttack() {
    if (selectedSpell === null) return;
    if (player.isMoving) return;

    const enemyDamageSound1 = "./enemy-sound-effects/damage/209_fx_681.mp3.mp3";
    const enemyDamageSound2 = "./enemy-sound-effects/damage/212_fx_679.mp3.mp3";
    const enemyDamageSounds = [enemyDamageSound1, enemyDamageSound2];
    const playerAttackSoundBefore =
      "./player-sound-effects/attack/165_fx_720.mp3.mp3";
    const playerAttackSoundAfter =
      "./player-sound-effects/attack/pression_attack.mp3";
    const playerAttackSoundAfter2 =
      "./player-sound-effects/attack/pression_attack_2.mp3";
    const playerAttacksAfter = [
      playerAttackSoundAfter,
      playerAttackSoundAfter2,
    ];

    const initialImage = "./player-static/player-static-front-right.png";

    const pression = generatePression();

    const distance = calculateDistance(player.position, enemy.position);

    const position = calculateEnemyPositionComparedToPlayer(
      enemy.position,
      player.position
    );

    const enemyInitialImage = enemy.illustration;

    switch (selectedSpell.attackName) {
      case "Pression":
        setEnemyInfo("pv", (enemy.pv -= pression.damage! + playerBoostAmont));

        if (player.isPressionAnimated) {
          addErrorMessage("Action impossible");
          playErrorSound(0.5);
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
          return;
        }

        if (player.pa <= 0) {
          addErrorMessage(`Plus assez de points d'action`);
          playErrorSound(0.5);
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
          return;
        }

        if (player.pa < pression.cost) {
          addErrorMessage(`Plus assez de points d'action`);
          playErrorSound(0.5);
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
          return;
        }

        if (distance > pression.range) {
          addErrorMessage("la cible est hors de portée");
          playErrorSound(0.5);
          setSelectedSpell(null);
          setAttackRangeDisplay([]);
          return;
        }

        setPlayerInfo("isPressionAnimated", true);

        if (enemy.pv > 0) {
          switch (enemy.orientation) {
            case "up":
              setTimeout(() => {
                setEnemyInfo("isAttacked", true);
                animationUp(enemy);
                setEnemyInfo(
                  "illustration",
                  "./enemy-animations/bouftou-damage-left.gif"
                );
              }, 500);

              setTimeout(() => {
                setEnemyInfo("illustration", enemyInitialImage);
                setEnemyInfo("isAttacked", false);
              }, 750);
              break;
            case "down":
              setTimeout(() => {
                setEnemyInfo("isAttacked", true);
                animationDown(enemy);
                setEnemyInfo(
                  "illustration",
                  "./enemy-animations/bouftou-damage.gif"
                );
              }, 500);

              setTimeout(() => {
                setEnemyInfo("illustration", enemyInitialImage);
                setEnemyInfo("isAttacked", false);
              }, 750);
              break;
            case "right":
              setTimeout(() => {
                setEnemyInfo("isAttacked", true);
                animationRight(enemy);
                setEnemyInfo(
                  "illustration",
                  "./enemy-animations/bouftou-damage.gif"
                );
              }, 500);

              setTimeout(() => {
                setEnemyInfo("illustration", enemyInitialImage);
                setEnemyInfo("isAttacked", false);
              }, 750);
              break;
            case "left":
              setTimeout(() => {
                setEnemyInfo("isAttacked", true);
                animationLeft(enemy);
                setEnemyInfo(
                  "illustration",
                  "./enemy-animations/bouftou-damage-left.gif"
                );
              }, 500);
              setTimeout(() => {
                setEnemyInfo("illustration", enemyInitialImage);
                setEnemyInfo("isAttacked", false);
              }, 750);
              break;
            default:
              break;
          }
        }

        switch (position) {
          case "up":
            setPlayerInfo("orientation", "up");
            animationUp(player);
            setPlayerInfo(
              "illustration",
              "./player-animations/attack-close-animation-left.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerOnAttackMode(false);
              setPlayerInfo(
                "illustration",
                "./player-static/player-static-left.png"
              );
            }, 1000);
            break;
          case "down":
            setPlayerInfo("orientation", "down");
            animationDown(player);
            setPlayerInfo(
              "illustration",
              "./player-animations/attack-close-animation-1.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerOnAttackMode(false);
              setPlayerInfo(
                "illustration",
                "./player-static/player-static-front-right.png"
              );
            }, 1000);
            break;
          case "left":
            setPlayerInfo("orientation", "left");
            animationLeft(player);
            setPlayerInfo(
              "illustration",
              "./player-animations/attack-close-animation-left.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerOnAttackMode(false);
              setPlayerInfo(
                "illustration",
                "./player-static/player-static-left.png"
              );
            }, 1000);
            break;
          case "right":
            setPlayerInfo("orientation", "right");
            animationRight(player);
            setPlayerInfo(
              "illustration",
              "./player-animations/attack-close-animation-1.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerOnAttackMode(false);
            }, 1000);
            break;
          default:
            break;
        }

        setTimeout(() => {
          playAudio(playerAttackSoundBefore, 0.1, false, true);
        }, 400);

        setTimeout(() => {
          playAudio(
            playerAttacksAfter[getRandomInt(playerAttacksAfter.length)],
            0.1,
            false,
            true
          );
        }, 400);

        setTimeout(() => {
          playAudio(
            enemyDamageSounds[getRandomInt(enemyDamageSounds.length)],
            0.1,
            false,
            true
          );
        }, 450);

        setTimeout(() => {
          setEnemyInfo("damageTaken", pression.damage! + playerBoostAmont);
        }, 400);

        setTimeout(() => {
          setEnemyInfo("damageTaken", null);
        }, 1400);

        setSelectedSpell(null);
        setPlayerInfo("pa", (player.pa -= pression.cost));
        setAttackRangeDisplay([]);
        addInfoMessage(`${player.name} lance ${pression.attackName}.`);
        addInfoMessage(
          `${player.name} inflige ${
            pression.damage! + playerBoostAmont
          } points de dommage à ${enemy.name}.`
        );
        if (enemy.pv <= 0) {
          const bouftoudeathBefore =
            "./enemy-sound-effects/death/331_fx_571.mp3.mp3";
          const bouftoudeathAfter =
            "./enemy-sound-effects/death/316_fx_585.mp3.mp3";

          setEnemyInfo("isDead", true);
          switch (enemy.orientation) {
            case "up":
              animationUp(enemy);
              setEnemyInfo(
                "illustration",
                "./enemy-animations/bouftou-death-left.gif"
              );
              break;
            case "down":
              animationDown(enemy);
              setEnemyInfo(
                "illustration",
                "./enemy-animations/bouftou-death.gif"
              );
              break;
            case "left":
              animationLeft(enemy);
              setEnemyInfo(
                "illustration",
                "./enemy-animations/bouftou-death-left.gif"
              );
              break;
            case "right":
              animationRight(enemy);
              setEnemyInfo(
                "illustration",
                "./enemy-animations/bouftou-death.gif"
              );
              break;
            default:
              break;
          }
          playAudio(bouftoudeathBefore, 0.3, false, true);
          setTimeout(() => {
            playAudio(bouftoudeathAfter, 0.3, false, true);
          }, 500);
          setTimeout(() => {
            setIsGameWin(true);
          }, 1500);
          return;
        }
        return;
      default:
        setSelectedSpell(null);
        return;
    }
  }

  function playerBoost() {
    if (player.isMoving) return;
    if (boostDuration !== undefined) return;
    if (selectedSpell === null) return;
    const boostSoundBefore = "./player-sound-effects/boost/iop_boost.mp3";
    const boostSoundAfter = "./player-sound-effects/boost/233_fx_66.mp3.mp3";
    const distance = calculateDistance(player.position, player.position);
    const compulsion = generateCompulsion();
    const initialImage = player.illustration;

    switch (selectedSpell.attackName) {
      case "Compulsion":
        if (distance > compulsion.range) return;

        if (player.pa <= 0) {
          addErrorMessage(`Plus assez de points d'action`);
          return;
        }

        if (player.pa < compulsion.cost) {
          addErrorMessage(`Plus assez de points d'action`);
          return;
        }

        setPlayerInfo("isCompulsionAnimated", true);

        switch (player.orientation) {
          case "up":
            animationUp(player);
            setPlayerInfo(
              "illustration",
              "./player-animations/boost-animation-left.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerOnAttackMode(false);
              setPlayerInfo(
                "illustration",
                "./player-static/player-static-left.png"
              );
            }, 1000);
            break;
          case "down":
            animationDown(player);
            setPlayerInfo(
              "illustration",
              "./player-animations/boost-animation.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerOnAttackMode(false);
              setPlayerInfo(
                "illustration",
                "./player-static/player-static-front-right.png"
              );
            }, 1000);
            break;
          case "left":
            animationLeft(player);
            setPlayerInfo(
              "illustration",
              "./player-animations/boost-animation-left.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerOnAttackMode(false);
              setPlayerInfo(
                "illustration",
                "./player-static/player-static-left.png"
              );
            }, 1000);
            break;
          case "right":
            animationRight(player);
            setPlayerInfo(
              "illustration",
              "./player-animations/boost-animation.gif"
            );
            setTimeout(() => {
              setPlayerInfo("illustration", initialImage);
              setPlayerInfo("isPressionAnimated", false);
              setPlayerOnAttackMode(false);
            }, 1000);
            break;
          default:
            break;
        }
        setTimeout(() => {
          setPlayerInfo("illustration", initialImage);
          setPlayerInfo("isCompulsionAnimated", false);
          setPlayerOnAttackMode(false);
        }, 1000);

        setTimeout(() => {
          playAudio(boostSoundBefore, 0.1, false, true);
        }, 100);

        setTimeout(() => {
          playAudio(boostSoundAfter, 0.1, false, true);
        }, 150);

        setPlayerBoostAmont(compulsion.boost!);
        addInfoMessage(`${player.name} lance ${compulsion.attackName}.`);
        addInfoMessage(
          `${player.name} gagne ${compulsion.boost} points de dommage pendant 5 tours.`
        );
        setBoostDuration(5);
        setSelectedSpell(null);
        setAttackRangeDisplay([]);
        setPlayerInfo("pa", (player.pa -= compulsion.cost));

        return;
      default:
        return;
    }
  }

  function animationLeft(entity: Player | Enemy) {
    if (entity.type === "Player") {
      setPlayerInfo("isIllustrationReverted", false);
      setPlayerInfo("isIllustrationPositionCorrectedUp", false);
      setPlayerInfo("isIllustrationPositionCorrectedDown", false);
      setPlayerInfo("isIllustrationPositionCorrectedLeft", true);
      return;
    } else if (entity.type === "Enemy") {
      setEnemyInfo("isIllustrationReverted", false);
      setEnemyInfo("isIllustrationPositionCorrectedUp", false);
      setEnemyInfo("isIllustrationPositionCorrectedDown", false);
      setEnemyInfo("isIllustrationPositionCorrectedLeft", true);
      return;
    }
  }

  function animationRight(entity: Player | Enemy) {
    if (entity.type === "Player") {
      setPlayerInfo("isIllustrationReverted", false);
      setPlayerInfo("isIllustrationPositionCorrectedUp", false);
      setPlayerInfo("isIllustrationPositionCorrectedDown", false);
      setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
      return;
    } else if (entity.type === "Enemy") {
      setEnemyInfo("isIllustrationReverted", false);
      setEnemyInfo("isIllustrationPositionCorrectedUp", false);
      setEnemyInfo("isIllustrationPositionCorrectedDown", false);
      setEnemyInfo("isIllustrationPositionCorrectedLeft", false);
      return;
    }
  }

  function animationUp(entity: Player | Enemy) {
    if (entity.type === "Player") {
      setPlayerInfo("isIllustrationReverted", true);
      setPlayerInfo("isIllustrationPositionCorrectedUp", true);
      setPlayerInfo("isIllustrationPositionCorrectedDown", false);
      setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
      return;
    } else if (entity.type === "Enemy") {
      setEnemyInfo("isIllustrationReverted", true);
      setEnemyInfo("isIllustrationPositionCorrectedUp", true);
      setEnemyInfo("isIllustrationPositionCorrectedDown", false);
      setEnemyInfo("isIllustrationPositionCorrectedLeft", false);
      return;
    }
  }

  function animationDown(entity: Player | Enemy) {
    if (entity.type === "Player") {
      setPlayerInfo("isIllustrationReverted", true);
      setPlayerInfo("isIllustrationPositionCorrectedUp", false);
      setPlayerInfo("isIllustrationPositionCorrectedDown", true);
      setPlayerInfo("isIllustrationPositionCorrectedLeft", false);
      return;
    } else if (entity.type === "Enemy") {
      setEnemyInfo("isIllustrationReverted", true);
      setEnemyInfo("isIllustrationPositionCorrectedUp", false);
      setEnemyInfo("isIllustrationPositionCorrectedDown", true);
      setEnemyInfo("isIllustrationPositionCorrectedLeft", false);
      return;
    }
  }

  return {
    enemyAttack,
    playerAttack,
    playerBoost,
    animationUp,
    animationDown,
    animationLeft,
    animationRight,
  };
}
