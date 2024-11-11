import { useKeyboardMovement } from "./useKeyboardMovement";
import { useMove } from "./useMove";
import { Address } from "viem";

export type Props = {
  players: {
    player: Address;
    x: number;
    y: number;
  }[];
};

export function Map({ players }: Props) {
  const move = useMove();
  useKeyboardMovement(move.mutateAsync);

  const size = 40;
  const scale = 100 / size;

  return (
    <div className="aspect-square w-full max-w-[40rem]">
      <div className="w-full h-full relative font-mono whitespace-pre border-8">
        {Object.values(players).map((position) => (
          <div
            key={position.player}
            className="absolute bg-black"
            style={{
              width: `${scale}%`,
              height: `${scale}%`,
              left: `${(((position.x % size) + size) % size) * scale}%`,
              top: `${((size - (position.y % size)) % size) * scale}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
