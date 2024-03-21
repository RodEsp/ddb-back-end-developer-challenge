import exp from 'constants';
import saveData from '../data/briv.json';
import Character from '../src/character';
import { DamageType } from '../src/types';

describe('character.ts', () => {
	let c;
	beforeEach(() => {
		// @ts-ignore
		c = new Character(saveData);
	});
	afterEach(() => {
		// Max hit points should not change for these tests
		expect(c.hitPoints.max).toEqual(saveData.hitPoints);
	});

	it ('should initialize a character correctly', () => {
		// @ts-ignore
		expect(c.name).toEqual(saveData.name);
		expect(c.level).toEqual(saveData.level);
		expect(c.hitPoints.current).toEqual(saveData.hitPoints);
		expect(c.hitPoints.max).toEqual(saveData.hitPoints);
		expect(c.hitPoints.temp).toEqual(0);
		expect(c.classes).toEqual(saveData.classes);
		expect(c.stats).toEqual(saveData.stats);
		expect(c.items).toEqual(saveData.items);
		expect(c.defenses).toEqual([
			{ damageType: DamageType.Fire, multiplier: 0 },
			{ damageType: DamageType.Slashing, multiplier: 0.5 }
		])
	});

	it ('should heal character', () => {
		let healing = 4;

		c.modifyHitPoints(-5);
		expect(c.hitPoints.current).toEqual(saveData.hitPoints - 5);
		c.modifyHitPoints(healing);
		expect(c.hitPoints.current).toEqual(saveData.hitPoints - 1);
	});

	it ('should not heal hit points above the max', () => {
		c.modifyHitPoints(10);
		expect(c.hitPoints.current).toEqual(saveData.hitPoints);
	});

	it ('should not set hit points to less than zero', () => {
		c.modifyHitPoints(-99999);
		expect(c.hitPoints.current).toEqual(0);
	});

	it ('should ensure temp hit points are not additive', () => {
		c.modifyHitPoints(10, true);
		expect(c.hitPoints.temp).toEqual(10);
		c.modifyHitPoints(20, true);
		expect(c.hitPoints.temp).toEqual(20);
	});

	it ('should not overwrite temp hit points with a lower value', () => {
		c.modifyHitPoints(7, true);
		expect(c.hitPoints.temp).toEqual(7);
		c.modifyHitPoints(2, true);
		expect(c.hitPoints.temp).toEqual(7);
	});

	it ('should not add negative temp hit points', () => {
		let tempHitPoints = -5;

		expect(() => {c.modifyHitPoints(tempHitPoints, true)}).toThrow('Can not add negative temporary hit points.');
	});

	it ('should take damage', () => {
		c.damage(DamageType.Cold, 2);
		expect(c.hitPoints.current).toEqual(saveData.hitPoints - 2);
	});

	it ('should take resistances into account', () => {
		let damage = 16;

		c.damage(DamageType.Fire, damage);
		expect(c.hitPoints.current).toEqual(saveData.hitPoints);
		c.damage(DamageType.Slashing, damage);
		expect(c.hitPoints.current).toEqual(saveData.hitPoints - (damage/2));
	});

	it ('should take damage from temp hit points first', () => {
		let damage = 5;
		let tempHitPoints = 6;

		c.modifyHitPoints(tempHitPoints, true);
		c.damage(DamageType.Acid, damage);
		expect(c.hitPoints.temp).toEqual(1);
		expect(c.hitPoints.current).toEqual(saveData.hitPoints);
		c.damage(DamageType.Acid, damage);
		expect(c.hitPoints.temp).toEqual(0);
		expect(c.hitPoints.current).toEqual(saveData.hitPoints - 4);
	});
});
