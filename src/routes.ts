import { Request, Response } from 'express';
import { dealDamage, healHitPoints } from './session.js';
import { DamageType, DamageTypes } from './types.js';

export default [
	{ 
		path: '/deal-damage',
		handler: async (req: Request, res: Response) => {
			try {
				let { name, type, amount } = req.body;

				const sanitizedDamageType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
				const damageTypes = Object.keys(DamageType).filter(t => Number.isNaN(parseInt(t))); // Have to filter these because of how enums are represented as objects by Typescript
				if (!damageTypes.find(type => type === sanitizedDamageType)) {
					throw `Damage type '${type}' does not exist. It must be one of the following: ${damageTypes.join(', ')}`
				}

				const damageType = DamageType[sanitizedDamageType];

				const character = dealDamage(name, amount, damageType as unknown as DamageType);

				res.status(200).send(character);
			} catch (e) {
				console.error(e);
				if (e) {
					res.status(400).send(formatError(e));
				} else {
					res.status(500).send(formatError(e));
				}
			}
		}
	},
	{ 
		path: '/heal',
		handler: async (req: Request, res: Response) => {
			try {
				let { name, amount, temp } = req.body;

				const character = healHitPoints(name, amount, temp);

				res.status(200).send(character);
			} catch (e) {
				res.status(500).send(formatError(e));
			}
		}
	},
];

function formatError(e) {
	let message: string;
	try {
		message = JSON.parse(e);
	} catch (err) {}

	return {
		error: message ? message : e,
		status: e.status ? e.status : 500
	}
};
