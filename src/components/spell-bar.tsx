export default function SpellBar() {
  const numbers = ["A", "B", "C", "D"];
  return (
    <>
      <div className="text-white h-[10vh] w-full flex justify-center items-center gap-1">
        {numbers.map((e, index) => (
          <div
            key={index}
            className="border-2 w-12 h-12 flex justify-center items-center hover:bg-gray-500 hover:cursor-pointer"
          >
            {e}
          </div>
        ))}
      </div>
    </>
  );
}
