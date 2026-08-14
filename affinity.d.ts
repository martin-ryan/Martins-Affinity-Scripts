/** 

* Ambient Type Definitions for Affinity Studio scripting engine
*/

declare module "/document" {
	export class Document {
		static get current(): Document | null;
		executeCommand(command: any): void;
		get selection(): SelectionInstance;
		// Fix: Added global document tree properties for selection-free scanning
		get nodes(): NodeListInstance;
		get root(): RootContainerInstance;
	}

	export interface SelectionInstance {
		nodes: NodeListInstance;
	}

	export interface NodeListInstance {
		toArray(): any[];
	}

	export interface RootContainerInstance {
		nodes: NodeListInstance;
	}

}

declare module "/commands" {
	export class DocumentCommand {
		static createSetText(selection: any, text: string): any;
		static createTransform(selection: any, transformMatrix: any): any;
		static createSetOpacity(selection: any, opacity: number): any;
		static createSetVisibility(selection: any, visible: boolean): any;
		static createDeleteSelection(selection: any): any;
		static createHideSelection(selection: any): any;
		static createSelectAll(doc: any): any;
		// Fix: Cleared out the duplicate method line, leaving only this working version
		static createSetTagColour(selection: any, colour: any): any;
	}

	export class CompoundCommandBuilder {
		static create(): CompoundCommandBuilderInstance;
	}

	export interface CompoundCommandBuilderInstance {
		addCommand(command: any): void;
		createCommand(): any;
	}

}

declare module "/colours" {
	export class Colour {
		get alpha(): number;
		set alpha(value: number): void;
	}
	export function RGB8(r: number, g: number, b: number): any;
	export function RGBA8(r: number, g: number, b: number, alpha?: number): any;
	export function I8(intensity: number): any;
	export function IA8(intensity: number, alpha?: number): any;
}

declare module "affinity:dom" {
	export const PredefinedTagKey: {
		None: any;
		Red: any;
		Orange: any;
		Yellow: any;
		Green: any;
		Blue: any;
		Purple: any;
	};
}

declare module "/selections" {
	export class Selection {
		static create(doc: any, nodes: any | any[]): any;
	}
}

declare module "/geometry" {
	export class Transform {
		static createIdentity(): TransformInstance;
		static createTranslate(x: number, y: number): TransformInstance;
		static createScale(scaleX: number, scaleY: number): TransformInstance;
		static createRotate(angleInDegrees: number): TransformInstance;
	}

	export interface TransformInstance {
		multiply(otherTransform: TransformInstance): TransformInstance;
	}
}

declare module "/dialog" {
	export const Dialog: any;
	export const DialogResult: any;
}

declare module "/units" {
	export const UnitType: any;
}

// Global ambient variables provided by the sandbox context
declare const environment: {
	activeDocument: any;
};

declare function alert(message: string): void;
declare function confirm(message: string, defaultValue?: string): string;
declare function prompt(message: string, defaultValue?: string): string;

// The magic line that tricks VS Code into accepting ambient module maps inside standard workspaces
export { };