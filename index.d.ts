export type EMPTY_LINE = "EMPTY_LINE";
export type KEY_VALUE = "KEY_VALUE";
export type COMMENT = "COMMENT";
export type INVALID_LINE = "INVALID_LINE";

export const EMPTY_LINE: EMPTY_LINE;
export const KEY_VALUE: KEY_VALUE;
export const COMMENT: COMMENT;
export const INVALID_LINE: INVALID_LINE;

// single quote, double quote, or empty string
export type Quote = '"' | "'" | "";

export interface DotenvKeyValueNode {
	type: KEY_VALUE;
	key: string;
	fullKey: string;
	value: string;
	escapedValue: string;
	fullValue: string;
	quote: Quote;
	originalQuote: Quote;
}

export interface DotenvEmptyLineNode {
	type: EMPTY_LINE;
}

export interface DotenvCommentNode {
	type: COMMENT;
	prefix: string;
	comment: string;
}

export interface DotenvInvalidLineNode {
	type: INVALID_LINE;
	text: string;
}

export type DotenvNode =
	| DotenvCommentNode
	| DotenvEmptyLineNode
	| DotenvKeyValueNode
	| DotenvInvalidLineNode;

export type DotenvNodeList = DotenvNode[];

export function textToAst(text: string): DotenvNodeList;

export function astToText(nodeList: DotenvNodeList): string;

export function appendKeyValue(
	nodeList: DotenvNodeList,
	key: string,
	value: string,
): DotenvNodeList;

export function changeKey(
	nodeList: DotenvNodeList,
	index: number,
	newKey: string,
): DotenvNodeList;

export function changeValue(
	nodeList: DotenvNodeList,
	index: number,
	newValue: string,
): DotenvNodeList;

export function removeKeyValue(
	nodeList: DotenvNodeList,
	index: number,
): DotenvNodeList;

export function parseAst(nodeList: DotenvNodeList): Record<string, any>;

export function parseText(text: string): Record<string, any>;
