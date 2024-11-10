import { useKeyboardMovement } from "./useKeyboardMovement";
import { useMove } from "./useMove";
import { stash } from "./mud/stash";
import { tables } from "./common";
import { useRecords } from "./mud/useRecords";

export function Map() {
  const move = useMove();
  useKeyboardMovement(move.mutateAsync);

  const players = useRecords({ stash, table: tables.Position });

  const size = 40;
  const scale = 100 / size;

  return (
    <div className="p-4" style={{ width: `80vmin`, height: `80vmin` }}>
      <div className="w-full h-full relative font-mono whitespace-pre border-8">
        {Object.values(players).map((position) => (
          <div
            key={position.player}
            className="absolute bg-black"
            style={{
              width: `${scale}%`,
              height: `${scale}%`,
              left: `${(((position.x % size) + size) % size) * scale}%`,
              top: `${((size - (position.y % size) + size) % size) * scale}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
