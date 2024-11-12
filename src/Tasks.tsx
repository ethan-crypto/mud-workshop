import { serialize, useConfig } from "wagmi";
import { stash } from "./mud/stash";
import { useRecords } from "./mud/useRecords";
import { useWorldContract } from "./mud/useWorldContract";
import { waitForTransactionReceipt } from "wagmi/actions";
import { twMerge } from "tailwind-merge";
import mudConfig from "../mud.config";

export function Tasks() {
  const wagmiConfig = useConfig();
  const { worldContract } = useWorldContract();
  const tasks = useRecords({
    stash,
    table: mudConfig.namespaces.app.tables.Tasks,
  });
  return (
    <div className="font-mono whitespace-pre select-none">
      TODO{"\n"}
      {tasks.map((task) => (
        <span
          key={task.id}
          title={serialize(task, null, 2)}
          className={twMerge(worldContract ? "cursor-pointer" : null)}
          onClick={
            worldContract
              ? async () => {
                  if (task.completedAt) {
                    console.log("resetting task");
                    const hash = await worldContract.write.app__resetTask([
                      task.id,
                    ]);
                    console.log("reset task", hash);
                    const receipt = await waitForTransactionReceipt(
                      wagmiConfig,
                      {
                        hash,
                      }
                    );
                    console.log("reset task receipt", receipt);
                  } else {
                    console.log("completing task");
                    await worldContract?.write.app__completeTask([task.id]);
                  }
                }
              : undefined
          }
        >
          [{task.completedAt ? "x" : " "}] {task.description}
          {"\n"}
        </span>
      ))}
    </div>
  );
}
