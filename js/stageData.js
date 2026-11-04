export const STAGES = [
  {
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
        enemies: 5,
      },
    ],
  },
  {
    number: 2,
    startingTroops: 12,
    speed: 92,
    events: [
      {
        type: 'gate',
        y: 280,
        choices: [
          { operator: '+', value: 8 },
          { operator: '×', value: 2 },
        ],
      },
      {
        type: 'pathBattle',
        y: -40,
        enemies: [5, 11],
      },
      {
        type: 'gate',
        y: -360,
        choices: [
          { operator: '+', value: 6 },
          { operator: '÷', value: 2 },
        ],
      },
      {
        type: 'boss',
        y: -680,
        enemies: 10,
      },
    ],
  },
  {
    number: 3,
    startingTroops: 14,
    speed: 92,
    events: [
      {
        type: 'gate',
        y: 280,
        choices: [
          { operator: '+', value: 10 },
          { operator: '×', value: 2 },
        ],
      },
      {
        type: 'pathBattle',
        y: -40,
        enemies: [3, 9],
      },
      {
        type: 'gate',
        y: -360,
        choices: [
          { operator: '×', value: 2 },
          { operator: '+', value: 16 },
        ],
      },
      {
        type: 'pathBattle',
        y: -680,
        enemies: [18, 8],
      },
      {
        type: 'gate',
        y: -1000,
        choices: [
          { operator: '−', value: 6 },
          { operator: '÷', value: 2 },
        ],
      },
      {
        type: 'boss',
        y: -1320,
        enemies: 20,
      },
    ],
  },
];
