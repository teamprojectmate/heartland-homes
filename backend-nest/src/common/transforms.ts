import type { TransformFnParams } from 'class-transformer';

/** Trims strings and leaves other values untouched, so class-validator reports them as a 400 instead of a TypeError (500). */
export const trimString = ({ value }: TransformFnParams): unknown =>
	typeof value === 'string' ? value.trim() : value;

/** Same as `trimString`, plus lower-case — for e-mail addresses. */
export const normalizeEmail = ({ value }: TransformFnParams): unknown =>
	typeof value === 'string' ? value.trim().toLowerCase() : value;
