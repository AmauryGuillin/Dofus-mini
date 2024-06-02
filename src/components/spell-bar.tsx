export default function SpellBar() {
  const spellsSources = [
    "./images/player-spells/141.svg",
    "./images/player-spells/144.svg",
  ];
  return (
    <>
      <div className="text-white h-[10vh] w-full flex items-start pt-2 pl-2 gap-1">
        {spellsSources.map((spell, index) => (
          <div
            key={index}
            className="w-12 h-12 flex justify-center items-center hover:bg-gray-500 hover:cursor-pointer hover:scale-105"
          >
            <img src={spell} className="w-80" />
          </div>
        ))}
      </div>
    </>
  );
}
