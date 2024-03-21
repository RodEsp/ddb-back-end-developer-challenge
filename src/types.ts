export type HitPoints = {
	max: number,
	current: number,
	temp: number,
};

export enum Stat {
	Strength,
	Dexterity,
	Constitution,
	Intelligence,
	Wisdom,
	Charisma,
};
export type Stats = Record<Lowercase<keyof typeof Stat>, number>;

export type Item = { 
	name: string; 
	modifier: { 
		affectedObject: string; 
		affectedValue: string; 
		value: number; 
	}
};

export type Class = { 
	name: string;
	hitDiceValue: number;
	classLevel: number;
};


export enum DamageType {
	Bludgeoning,
	Piercing,
	Slashing,
	Fire,
	Cold,
	Acid,
	Thunder,
	Lightning,
	Poison,
	Radiant,
	Necrotic,
	Psychic,
	Force,
};
export const DamageTypes = Object.keys(DamageType).filter(t => Number.isNaN(parseInt(t))) as Array<Lowercase<keyof typeof DamageType>>; // Have to filter these because of how enums are represented as objects by Typescript

export enum DefenseMultiplier {
	Immunity = 0,
	Resistance = 0.5,
};

export type Defense = { 
	damageType: DamageType;
	multiplier: DefenseMultiplier;
};
export type DefenseSaveFormat = { 
	type: Lowercase<keyof typeof DamageType>;
	defense: Lowercase<keyof typeof DefenseMultiplier>;
};

export type APIError = {
	error: string,
	status: number,
};
