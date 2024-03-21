import { Class, DamageType, Defense, DefenseMultiplier, DefenseSaveFormat, HitPoints, Item, Stats } from "./types.js";

export type CharacterSaveData = Omit<Character, 'hitPoints' | 'defenses' | 'damage' | 'modifyHitPoints' > & { filename: string, hitPoints: number, defenses: Array<DefenseSaveFormat> }
export default class Character {
	id: string;
	name: string;
	level: number;
	hitPoints: HitPoints;
	classes: Array<Class>;
	stats: Stats;
	items: Array<Item>;
	defenses: Array<Defense>;

	constructor(data: CharacterSaveData) {
		this.id = data.filename;
		this.name = data.name;
		this.level = data.level;
		this.hitPoints = {
			max: data.hitPoints,
			current: data.hitPoints,
			temp: 0,
		};
		this.classes = data.classes;
		this.stats = data.stats;
		this.items = data.items;
		this.defenses = data.defenses.map((defense) => ({
			damageType: DamageType[defense.type.charAt(0).toUpperCase() + defense.type.slice(1)],
			multiplier: DefenseMultiplier[defense.defense.charAt(0).toUpperCase() + defense.defense.slice(1)],
		}));
	};

	damage = function damageCharacter(type: DamageType, amount: number) {
		let adjusted_damage = amount;
		let defense = this.defenses.find((d: Defense) => d.damageType === type);

		if (defense) {
			adjusted_damage = Math.floor(amount * defense.multiplier); // This should always be rounded down according to the player handbook: https://www.dndbeyond.com/sources/basic-rules/introduction#RoundDown
		}

		this.modifyHitPoints(-adjusted_damage);
	}
	modifyHitPoints = function modifyCharacterHitPoints(amount: number, temp: boolean = false): HitPoints {
		if (temp === true) {
			if (amount < 0) {
				throw "Can not add negative temporary hit points.";
			}

			this.hitPoints.temp = Math.max(this.hitPoints.temp, amount); // Ensure we always take the greater amount of temp hit points
			return this.hitPoints;
		}

		if (amount < 0) {
			this.hitPoints.temp += amount;

			// If the amount removed was higher than the temp hit points
			//  remove the extra amount from the current hit points
			//  and set the temp hit points to 0
			if (this.hitPoints.temp < 0) {
				this.hitPoints.current += this.hitPoints.temp;
				this.hitPoints.current = Math.max(0, this.hitPoints.current); // Ensures hit points can't go below 0
				this.hitPoints.temp = 0;
			}
		} else {
			// Add to hitpoints without going over the max
			this.hitPoints.current = Math.min(this.hitPoints.max, this.hitPoints.current += amount);
		}
		return this.hitPoints;
	}
};
