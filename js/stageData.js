export const DEMO_STAGE = {
  number: 1,
  startingTroops: 10,
  speed: 92,
  events: [
    {
      type: 'gate',
      y: 280,
      choices: [
        { operator: '+', value: 6 },
        { operator: '×', value: 2 },
      ],
    },
    {
      type: 'pathBattle',
      y: -40,
      enemies: [3, 8],
    },
    {
      type: 'gate',
      y: -360,
      choices: [
        { operator: '−', value: 4 },
        { operator: '÷', value: 2 },
      ],
    },
    {
      type: 'boss',
      y: -680,
      enemies: 7,
    },
  ],
};
