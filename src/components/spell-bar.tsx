type Props = {
  setSelectedSpell: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export default function SpellBar({ setSelectedSpell }: Props) {
  const spellsSources = [
    "./images/player-spells/141.svg",
    "./images/player-spells/144.svg",
  ];

  function selectSpell(spell: number) {
    setSelectedSpell(spell);
  }

  return (
    <>
      <div className="text-white h-full w-full flex items-start pt-2 pl-2 gap-1 bg-slate-950">
        {spellsSources.map((spell, index) => (
          <div
            key={index}
            className="w-12 h-12 flex justify-center items-center hover:bg-gray-500 hover:cursor-pointer hover:scale-105"
            onClick={() => selectSpell(index)}
          >
            <img src={spell} className="w-80" />
          </div>
        ))}
      </div>
    </>
  );
}
