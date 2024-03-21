import { Request, Response } from 'express';
import { characterExists, dealDamage, healHitPoints } from './session.js';
import { DamageType, DamageTypes } from './types.js';

interface APIError extends Error {
	status: number,
}
function APIError(status: number, msg: string): APIError {
	const error = new Error(msg) as APIError;
	error.name = 'APIError';
	error.status = status;
	return error;
}

export default [
	{ 
		path: '/deal-damage',
		handler: async (req: Request, res: Response): Promise<void | APIError> => {
			try {
				let { character_id, amount, type } = req.body;
				validateCharacter(character_id);

				const capitalizedDamageType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(); // Capitalize the damage type so that it matches the DamageType enum keys
				if (!DamageTypes.find(type => type === capitalizedDamageType)) {
					throw APIError(400, `Damage type '${type}' does not exist. It must be one of the following: ${DamageTypes.join(', ')}`);
				}

				const damageType = DamageType[capitalizedDamageType];
				const character = dealDamage(character_id, amount, damageType as unknown as DamageType);

				res.status(200).send(character);
			} catch (e) {
				handleError(e, res);
			}
		}
	},
	{ 
		path: '/heal',
		handler: async (req: Request, res: Response) => {
			try {
				let { character_id, amount, temp } = req.body;
				validateCharacter(character_id);

				if (amount < 0) {
					throw APIError(400, `Received '${amount}'. Can not heal character for a negative amount`);
				}

				const character = healHitPoints(character_id, amount, temp);

				res.status(200).send(character);
			} catch (e) {
				handleError(e, res);
			}
		}
	},
];

function validateCharacter(id: string) {
	if (!characterExists(id)) {
		throw APIError(400, `Could not find character with ID '${id}'`);
	}
}

function handleError(e: Error | APIError, res: Response) {
	console.error(e); // This would go to a logging service in a production application

	if (e.name === 'APIError') {
		res.status((e as APIError).status).send({
			error: (e as APIError).message,
			status: (e as APIError).status
		});
	} else {
		res.status(500).send({
			error: 'An unknown error occurred. Please try again later.',
			status: 500
		});
	}
};
