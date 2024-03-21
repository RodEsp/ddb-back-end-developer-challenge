import swaggerUI from 'swagger-ui-express';

import packageJSON from '../../package.json' with { type: 'json' };

const charExample = {
	id: "briv",
	name: "Briv",
	level: 5,
	hitPoints: {
		max: 25,
		current: 25,
		temp: 0
	},
	classes: [
		{
			name: "fighter",
			hitDiceValue: 10,
			classLevel: 5
		}
	],
	stats: {
		strength: 15,
		dexterity: 12,
		constitution: 14,
		intelligence: 13,
		wisdom: 10,
		charisma: 8
	},
	items: [
		{
			name: "Ioun Stone of Fortitude",
			modifier: {
				affectedObject: "stats",
				affectedValue: "constitution",
				value: 2
			}
		}
	],
	defenses: [
		{
			damageType: 3,
			multiplier: 0
		},
		{
			damageType: 2,
			multiplier: 0.5
		}
	]
};
const damageTypes = [
	'Bludgeoning',
	'Piercing',
	'Slashing',
	'Fire',
	'Cold',
	'Acid',
	'Thunder',
	'Lightning',
	'Poison',
	'Radiant',
	'Necrotic',
	'Psychic',
	'Force',
];

const openAPISpec = {
	openapi: '3.0.0',
	info: {
		title: packageJSON.name,
		version: packageJSON.version,
		description: packageJSON.description
	},
	paths: {
		'/api/deal-damage': {
			post: {
				summary: 'Deal damage to a given character',
				description: 'Calculates damage to apply to a character based on the damage type given and applies it.',
				operationId: 'deal-damage',
				requestBody: {
					description: 'The damage amount and type to deal to a character',
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['character_id', 'amount', 'type'],
								properties: {
									character_id: {
										type: 'string',
										example: 'briv'
									},
									amount: {
										type: 'number',
										example: 7
									},
									type: {
										type: 'string',
										enum: damageTypes
									}
								}
							}
						}
					}
				},
				responses: {
					200: {
						description: 'The character object',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									$ref: '#/components/schemas/character'
								},
								examples: {
									'Briv': {
										value: {
											...charExample,
											hitPoints: {
												...charExample.hitPoints,
												current: 17
											}
										}
									}
								}
							}
						}
					}
				}
			}
		},
		'/api/heal': {
			post: {
				summary: 'Deal damage to a given character',
				description: 'Calculates damage to apply to a character based on the damage type given and applies it.',
				operationId: 'heal',
				requestBody: {
					description: 'How much to heal a player',
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['character_id', 'amount'],
								properties: {
									character_id: {
										type: 'string',
										description: 'The character_id of the character to heal',
										example: 'briv'
									},
									amount: {
										type: 'number',
										description: 'The amount of hit points to heal',
										example: 7
									},
									temp: { 
										type: 'boolean',
										description: 'Whether you should add this as temporary hit points or not',
										example: false
									}
								}
							}
						}
					}
				},
				responses: {
					200: {
						description: 'The character object',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									$ref: '#/components/schemas/character'
								},
								examples: {
									'Briv': {
										value: {
											...charExample,
											hitPoints: {
												...charExample.hitPoints,
												temp: 9
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	components: {
		schemas: {
			character: {
				type: 'object',
				properties: {
					name: {
						type: 'string'
					},
					level: {
						type: 'number'
					},
					hitPoints: {
						type: 'object',
						properties: {
							max: { type: 'number' },
							current: { type: 'number' },
							temp: { type: 'number' }
						}
					},
					classes: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								name: { type: 'string' },
								hitDiceValue: { type: 'number' },
								classLevel: { type: 'number' }
							}
						}
					},
					stats: {
						type: 'object',
						properties: {
							strength: { type: 'number' },
							dexterity: { type: 'number' },
							constitution: { type: 'number' },
							intelligence: { type: 'number' },
							wisdom: { type: 'number' },
							charisma: { type: 'number' }
						}
					},
					items: {
						type: 'object',
						properties: {
							name: { type: 'string' },
							modifier: {
								type: 'object',
								properties: {
									affectedObject: { type: 'string' },
									affectedValue: { type: 'string' },
									value: { type: 'number' },
								}
							}
						}
					},
					defenses: {
						type: 'object',
						properties: {
							damageType: { type: 'string', enum: damageTypes },
							multiplier: { type: 'number' }
						}
					}
				}
			}
		}
	}
};

export default { ui: swaggerUI, middleware: swaggerUI.setup(openAPISpec) };
