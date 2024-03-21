import fs from 'node:fs';

import d from 'debug';
import Character, { CharacterSaveData } from "./character.js";
import { DamageType } from './types.js';
import path from 'node:path';

const debug = d('session');

const characters: Record<string, Character> = {};

export default function startSession() {
	fs.readdirSync(path.resolve('data'), "utf8").forEach((file) => {
		try {
			console.group(`Loading character from ${file}`);
			let charData: CharacterSaveData = (JSON.parse(fs.readFileSync(path.join(path.resolve('data'), file), "utf8")));

			if (characters[charData.name]) {
				throw 'Character names must be unique';
			}

			let c = new Character(charData);
			characters[charData.name.toLowerCase()] = c;
			console.info(`${c.name} is ready for battle!`);
			console.groupEnd();
		} catch (e) {
			throw `Failed to load data from ${file}.\n${e}`;
		}
	});
};

function getCharacter(name) {
	let c = characters[name.toLowerCase()];

	if (c === undefined) {
		throw `Could not find character with name "${name}"`;
	}

	return c;
};

/**
 * Deals damage to a given character
 * @param name The name of the character to deal damage to
 * @param amount The amount of damage to deal
 * @param damageType The type of damage to be dealt
 * @returns The character after dealing damage to it
 */
export function dealDamage(name: string, amount: number, damageType: DamageType): Character {
	const c = getCharacter(name);
	c.damage(damageType, amount);
	return c;
};

/**
 * Heals a character's hit points, can also add temporary hit points
 * @param name  The name of the character to add hit points to
 * @param amount The amount of hit points to add
 * @param temp A boolean that defines whether the hit points are temporary hit points or not
 * @returns 
 */
export function healHitPoints(name: string, amount: number, temp: boolean): Character {
	const c = getCharacter(name);

	if (amount < 0) {
		throw `Received "${amount}". Can not heal character for a negative amount`;
	}

	c.modifyHitPoints(amount, temp);
	return c;
};
