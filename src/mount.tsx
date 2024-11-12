import "tailwindcss/tailwind.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { Providers } from "./mud/Providers.tsx";
import { getWorldDeploy } from "./mud/getWorldDeploy.ts";
import { chainId } from "./common.ts";

getWorldDeploy(chainId).then((worldDeploy) => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Providers worldDeploy={worldDeploy}>
        <App />
      </Providers>
    </StrictMode>
  );
});
