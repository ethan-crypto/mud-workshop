import { useKeyboardMovement } from "./useKeyboardMovement";
import { useMove } from "./useMove";
import { stash } from "./stash/stash";
import { tables } from "./common";
import { useRecords } from "./stash/useRecords";

export function Map() {
  const move = useMove();
  useKeyboardMovement(move.mutateAsync);

  const width = 100;
  const height = 100;

  const players = useRecords({ stash, table: tables.Position });

  return (
    <div
      className="relative font-mono whitespace-pre"
      style={{ width: `${width}em`, height: `${height}em` }}
    >
      {Object.values(players).map((position) => (
        <div
          key={position.player}
          className="absolute w-[1em] h-[1em]"
          style={{ left: `${position.x}em`, top: `${position.y}em` }}
        >
          x
        </div>
      ))}
    </div>
  );
}
