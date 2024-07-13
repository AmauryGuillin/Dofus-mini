import { useStore } from "@/hooks/store";

export default function EnemyInfo() {
  const enemy = useStore((state) => state.enemy);

  return (
    <>
      <div className="absolute top-[75%] left-[75%] border-2 w-[10%] h-[20%] p-2 rounded-lg">
        <div>{enemy.name}</div>
        <div>PV: {enemy.pv}</div>
        <div>PA: {enemy.pa}</div>
        <div>PM: {enemy.pm}</div>
      </div>
    </>
  );
}
