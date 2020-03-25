export type KEY_VALUE = "KEY_VALUE";
export type COMMENT = "COMMENT";
export type INVALID_LINE = "INVALID_LINE";

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
	| DotenvKeyValueNode
	| DotenvInvalidLineNode;

export type DotenvNodeList = DotenvNode[];

export function textToNodes(text: string): DotenvNodeList;

export function nodesToText(nodeList: DotenvNodeList): string;

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

export function parseNodes(nodeList: DotenvNodeList): Record<string, any>;

export function parseText(text: string): Record<string, any>;
