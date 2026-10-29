export function applyOperation(troops, choice) {
  let result = troops;

  switch (choice.operator) {
    case '+':
      result += choice.value;
      break;
    case '−':
      result -= choice.value;
      break;
    case '×':
      result *= choice.value;
      break;
    case '÷':
      result = Math.floor(result / choice.value);
      break;
    default:
      throw new Error(`지원하지 않는 연산입니다: ${choice.operator}`);
  }

  return Math.max(0, result);
}
