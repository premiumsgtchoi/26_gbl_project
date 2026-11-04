export function getRequestedStageIndex(search, stageCount) {
  const stageNumber = Number(new URLSearchParams(search).get('stage'));
  const stageIndex = stageNumber - 1;
  return Number.isInteger(stageIndex) && stageIndex >= 0 && stageIndex < stageCount
    ? stageIndex
    : null;
}
