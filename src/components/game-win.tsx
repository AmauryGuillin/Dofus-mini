import { useStore } from "@/hooks/store";
import { playClickSounds } from "@/utils/music/handleAudio";
import { reloadPage } from "@/utils/tools/windowControls";
import { Skull } from "lucide-react";
import Confetti from "react-confetti";
import { XpBar } from "./ui/xp-bar";

export default function GameWin() {
  function handleRestart() {
    reloadPage();
    playClickSounds(0.5);
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900 relative">
      <Confetti gravity={0.05} />
      <div className="w-[60%] h-fit border-4 rounded-2xl flex flex-col">
        <div className="w-full h-[10%] bg-[#524A3C] rounded-tl-xl rounded-tr-xl flex items-center justify-between">
          <span className="text-white font-bold ml-2 sm:text-sm md:text-md lg-text-lg xl:text-xl ">
            Résultat du combat - Nombre de tours :&nbsp;
            {useStore.getState().turnCount}
          </span>
          <span className="text-white font-bold mr-2 sm:text-sm md:text-md lg-text-lg xl:text-xl ">
            0 minutes 12 secondes
          </span>
        </div>
        <div className="w-full h-[90%] bg-[#D5D0AA] rounded-bl-xl rounded-br-xl pb-10">
          <div className="w-full flex flex-col">
            <span className="font-bold text-xl m-5">Gagnants</span>
            <div className="w-full flex justify-center items-center">
              <table className="w-[98%]">
                <thead className="bg-[#524A3C] text-white">
                  <tr>
                    <th className="w-2/12">Nom</th>
                    <th className="w-1/12">Niv.</th>
                    <th className="w-2/12">XP gagnée</th>
                    <th className="w-1/12">Guilde</th>
                    <th className="w-1/12">Monture</th>
                    <th className="w-1/12">Kamas</th>
                    <th className="w-4/12">Objets gagnés</th>
                  </tr>
                </thead>
                <tbody className="bg-[#B4AB8E] text-center">
                  <tr>
                    <th>
                      <span>Iopette</span>
                    </th>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15">
                      1
                    </td>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15 h-full">
                      <div className="flex justify-evenly items-center w-full h-full">
                        <XpBar value={70} /> <span>750</span>
                      </div>
                    </td>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15">
                      The Sealk
                    </td>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15"></td>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15">
                      0
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <span className="font-bold text-xl m-5">Perdants</span>
            <div className="w-full flex justify-center items-center">
              <table className="w-[98%]">
                <thead className="bg-[#524A3C] text-white">
                  <tr>
                    <th className="w-2/12">Nom</th>
                    <th className="w-1/12">Niv.</th>
                    <th className="w-2/12">XP gagnée</th>
                    <th className="w-1/12">Guilde</th>
                    <th className="w-1/12">Monture</th>
                    <th className="w-1/12">Kamas</th>
                    <th className="w-4/12">Objets gagnés</th>
                  </tr>
                </thead>
                <tbody className="bg-[#B4AB8E] text-center">
                  <tr>
                    <th className="flex items-center justify-center">
                      {" "}
                      <Skull /> <span className="ml-2">Bouftou</span>
                    </th>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15">
                      1
                    </td>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15"></td>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15"></td>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15"></td>
                    <td className="border-l-[1px] border-r-[1px] border-orange-950 border-opacity-15">
                      0
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end w-[50%]">
        <button
          className="border-[3px] border-t-0 bg-[#F66600] text-white px-6 py-1 rounded-bl-xl rounded-br-xl hover:bg-[#CC5300]"
          onClick={handleRestart}
        >
          Recommencer
        </button>
      </div>
    </div>
  );
}
