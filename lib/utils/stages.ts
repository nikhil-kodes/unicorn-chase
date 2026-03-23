export const STAGE_POINTS: Record<string, number> = {
  alpha: 2,
  beta: 2,
  charlie: 3,
  delta: 3,
  gamma: 0,
}

export const STAGE_ORDER = ['alpha', 'beta', 'charlie', 'delta', 'gamma']

// Get the next pending stage
export const getNextStage = (progress: { stage: string, completed: boolean }[]) => {
  for (const s of STAGE_ORDER) {
    const p = progress.find(x => x.stage === s)
    if (p && !p.completed) return s
  }
  return null
}
