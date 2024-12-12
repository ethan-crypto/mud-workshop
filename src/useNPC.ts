import { useState, useEffect } from "react";
import { Direction } from "./common";
import {
  genWitness,
  prove,
  deserialize
} from '@ezkljs/engine/web'

export type NPCState = [playerX: number, playerY: number, hunterX: number, hunterY: number];

// TODO: not sure what are params reused across proving calls
type EZKLState = any;

type MoveResult = {
  direction: Direction;
  proof: Uint8Array;
}
function readUploadedFileAsBuffer(file: File) {
  return new Promise<Uint8ClampedArray>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target && event.target.result instanceof ArrayBuffer) {
        resolve(new Uint8ClampedArray(event.target.result))
      } else {
        reject(new Error('Failed to read file'))
      }
    }

    reader.onerror = (error) => {
      reject(new Error('File could not be read: ' + error))
    }
    reader.readAsArrayBuffer(file)
  })
}

type FileMapping = {
  [key: string]: File
}

type FileSerMapping = {
  [key: string]: Uint8ClampedArray
}

async function convertFilesToFilesSer<T extends FileMapping>(
  files: T,
): Promise<FileSerMapping> {
  const fileReadPromises = Object.entries(files).map(async ([key, file]) => {
    const fileContent = await readUploadedFileAsBuffer(file)
    return { key, fileContent }
  })

  const fileContents = await Promise.all(fileReadPromises)

  const filesSer: FileSerMapping = {}
  for (const { key, fileContent } of fileContents) {
    filesSer[key] = fileContent
  }

  return filesSer
}

// TODO: ezkl prover should compute the next move with a proof.
async function computeMove(npcState: NPCState, ezState: EZKLState): Promise<MoveResult> {
  // 
  // Fetch the files from public folder
  // Names of the sample files in the public directory
  const sampleFileNames: { [key: string]: string } = {
    pk: 'pk.key',
    compiled_onnx: 'network.compiled',
    srs: 'kzg.params',
  }

  // Helper function to fetch and create a file object from a public URL
  const fetchAndCreateFile = async (
    path: string,
    filename: string,
  ): Promise<File> => {
    const response = await fetch(path)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  // Fetch each sample file and create a File object
  const filePromises = Object.entries(sampleFileNames).map(([key, filename]) =>
    fetchAndCreateFile(`https://mud-downloads.ezkl.xyz/${filename}`, filename),
  )

  // Wait for all files to be fetched and created
  const files = await Promise.all(filePromises) as [File, File, File]

  // convert the npcState to a json object of type `{"input_data": [[6, 6, 3, 9]]}` and then convert to file format
  const npcStateJson = JSON.stringify({ "input_data": [npcState.values] });
  const npcStateFile = new File([npcStateJson], 'input.json', { type: 'application/json' });

  let genWitnessFileObject = {
    compiled_onnx: files[1],
    input: npcStateFile
  }

  let result = await convertFilesToFilesSer(genWitnessFileObject)

  let output
  if (result['compiled_onnx'] && result['input']) {
    output = genWitness(result['compiled_onnx'], result['input']);
  } else {
    throw new Error('Required files are missing');
  }

  let witness = deserialize(output)

  console.debug("witness", witness);

  // Now that we have the witness we can generate the proof.
  const witnessFile = new File([JSON.stringify(witness)], 'witness.json', { type: 'application/json' });

  let genProofFileObject = {
    data: witnessFile,
    pk: files[0],
    model: files[1],
    srs: files[2]
  }

  result = await convertFilesToFilesSer(genProofFileObject)

  if (result['data'] && result['pk'] && result['model'] && result['srs']) {
    output = prove(
      result['data'],
      result['pk'],
      result['model'],
      result['srs'],
    )
  } else {
    throw new Error('Required proof files are missing');
  }

  let proofData = deserialize(output)

  console.debug("proofData", proofData);

  return {
    direction: proofData.pretty_public_inputs.rescaled_outputs[0][0],
    proof: proofData.proof
  }

}

export function useNPC() {
  const [ezkl, setEzkl] = useState<EZKLState>(null);
  useEffect(() => {
    // TODO: init wasm
    async function initializeResources() {
      // Initialize the WASM module
      const engine = await import('@ezkljs/engine/web/ezkl.js')
      setEzkl(engine)
      await (engine as any).default(undefined, new WebAssembly.Memory({ initial: 20, maximum: 65536, shared: true }))
      // For human readable wasm debug errors call this function
      engine.init_panic_hook()
    }
    initializeResources()
  });
  return {
    move: (state: NPCState) => {
      if (ezkl) {
        const result = computeMove(state, ezkl);
      } else {
        console.error("EZKL was not initialized");
      }
    }
  }
}
