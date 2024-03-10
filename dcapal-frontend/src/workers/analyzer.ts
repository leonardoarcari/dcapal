import { Solver } from "dcapal-optimizer-wasm";
import { expose } from "threads/worker";

const buildProblemInput = (assets) => {
  return {
    type: "analyze",
    assets: {
      ...assets,
    },
  };
};

expose({
  async analyzeAndSolve(assets) {
    if (!assets || Object.keys(assets).length === 0) return null;

    const input = buildProblemInput(assets);

    const handle = Solver.build_problem(input);
    const solution = Solver.solve(handle);
    if (!Solver.delete_problem(handle)) {
      console.error(`Failed to delete solved problem (handle=${handle})`);
    }

    return solution;
  },
});
