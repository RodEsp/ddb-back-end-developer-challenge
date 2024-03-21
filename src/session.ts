import fs from 'node:fs';

import Character, { CharacterSaveData } from "./character.js";
import { DamageType } from './types.js';
import path from 'node:path';

const characters: Map<string, Character> = new Map();

export default function startSession() {
	fs.readdirSync(path.resolve('data'), "utf8").forEach((file) => {
		try {
			console.group(`Loading character from ${file}`);

			const charSaveData: CharacterSaveData = (JSON.parse(fs.readFileSync(path.join(path.resolve('data'), file), "utf8")));
			charSaveData.filename = path.parse(file).name; // Add filename so we can use it as the character ID

			if (characters.has(file)) {
				throw 'Character file names must be unique';
			}

			let c = new Character(charSaveData);
			characters.set(c.id, c);
			console.info(`${c.name} is ready for battle!`);
			console.groupEnd();
		} catch (e) {
			console.error(`Failed to load data from ${file}.\n${e}`); // Would log to a logging service in production
		}
	});
};

/**
 * @param id The character ID to look for
 * @returns A boolean that depicts if the character exists or not
 */
export function characterExists(id): boolean {
	return characters.has(id);
}

/**
 * @param id The character ID for the character to get
 * @returns The character instance
 */
function getCharacter(id): Character {
	let c = characters.get(id);

	if (c === undefined) {
		throw `Could not find character with ID "${id}"`;
	}

	return c;
};

/**
 * Deals damage to a given character
 * @param character_id The ID of the character to deal damage to
 * @param amount The amount of damage to deal
 * @param damageType The type of damage to be dealt
 * @returns The character after dealing damage to it
 */
export function dealDamage(character_id: string, amount: number, damageType: DamageType): Character {
	const c = getCharacter(character_id);
	c.damage(damageType, amount);
	return c;
};

/**
 * Heals a character's hit points, can also add temporary hit points
 * @param character_id  The ID of the character to add hit points to
 * @param amount The amount of hit points to add
 * @param temp A boolean that defines whether the hit points are temporary hit points or not
 * @returns 
 */
export function healHitPoints(character_id: string, amount: number, temp: boolean): Character {
	const c = getCharacter(character_id);
	c.modifyHitPoints(amount, temp);
	return c;
};
