/**
 * Ambient Type Definitions for the Affinity Studio Scripting Engine
 * Based on the native library implementation maps (Parts 1-7).
 * Updated to use global wildcard resolution patterns to fix IDE path errors.
 */

declare module "affinity:application" {
	export const ApplicationApi: {
		getCompileDate(): string;
		getPlatformName(): string;
		getShortVersion(): string;
		getVersion(): string;
		getBuildVersion(): string;
		getMajorVersion(): number;
		getMinorVersion(): number;
		getRevisionVersion(): number;
		getDocumentVersion(): string;
		getBuildKind(): any;
		getProductCopyrightMessage(): string;
		getProductFullName(): string;
		getProductLongName(): string;
		getProductPrimaryFileExtension(): string;
		getProductVersionName(): string;
		getProductShortName(): string;
		getSuiteFullName(): string;
		getUiParadigm(): any;
		getArgC(): number;
		getArgV(): string[];
	};
	export const ApplicationSettingsApi: {
		getLoadPSDWithEditableText(): boolean;
		setLoadPSDWithEditableText(value: boolean): void;
		getUndoLimit(): number;
	};
	export enum BuildKind { Regular, Beta, Customer }
	export enum UiParadigm { Desktop, Touch }
}

declare module "affinity:ui" {
	export const UiApi: {
		alert(message: string, title?: string): void;
		confirm(message: string, title?: string): boolean;
		prompt(message: string, title?: string, initialText?: string): string | null;
		chooseFile(): string | null;
		alertAsync(message: string, title: string, callback: () => void): void;
		confirmAsync(message: string, title: string, callback: (result: boolean) => void): void;
		promptAsync(message: string, title: string, initialText: string, callback: (result: string | null) => void): void;
		chooseFileAsync(callback: (path: string | null) => void): void;
	};
}

declare module "affinity:dom" {
	export const ArtboardInterfaceApi: any;
	export const ArtboardPropertiesApi: any;
	export const BaseBoxInterfaceApi: any;
	export const ImageResourceInterfaceApi: any;
	export const LayerEffectsInterfaceApi: any;
	export const TagInterfaceApi: any;
	export const TextFrameInterfaceApi: any;
	export const TransformInterfaceApi: any;
	export const TransparencyInterfaceApi: any;
	export const VisibilityInterfaceApi: any;

	export const PredefinedTagKey: {
		None: any;
		Red: any;
		Orange: any;
		Yellow: any;
		Green: any;
		Blue: any;
		Purple: any;
	};
	export enum EffectiveMarginBehaviour { Include, Exclude }
	export enum ConstraintType { None, Min, Max, Scale }
	export enum SpatialAnchor { TopLeft, TopCentre, TopRight, CentreLeft, Middle, CentreRight, BottomLeft, BottomCentre, BottomRight }
}

declare module "affinity:common" {
	export enum BlendMode { Passthrough, Normal, Darken, Multiply, ColorBurn, LinearBurn, Lighten, Screen, ColorDodge, LinearDodge, Overlay, SoftLight, HardLight, VividLight, LinearLight, PinLight, HardMix, Difference, Exclusion, Subtract, Divide, Hue, Saturation, Color, Luminosity }
	export enum AntialiasingMode { ForceOn, ForceOff, Inherit }
	export enum ContentType { Color, Gradient, Texture, Hatch, None }
	export enum UnitType { Pixels, Points, Picas, Inches, Feet, Yards, Millimeters, Centimeters, Meters }
	export enum UserUnitType { Document, Page }
}

declare module "affinity:timers" {
	export const TimersApi: any;
}

declare module "*/handleobject.js" {
	export class HandleObject {
		constructor(handle: any);
		get handle(): any;
	}
}

declare module "*/application.js" {
	import { HandleObject } from "*/handleobject.js";

	export class AppDocuments {
		get [Symbol.toStringTag](): string;
		get all(): any[];
		get current(): any;
		load(path: string): any;
	}

	export class ApplicationSettings {
		get [Symbol.toStringTag](): string;
		get loadPSDWithEditableText(): boolean;
		set loadPSDWithEditableText(value: boolean);
		get undoLimit(): number;
	}

	export class Application {
		constructor();
		get [Symbol.toStringTag](): string;
		get documents(): AppDocuments;
		get settings(): ApplicationSettings;
		alert(message: string, title?: string): void;
		confirm(message: string, title?: string): boolean;
		prompt(message: string, title?: string, initialText?: string): string | null;
		chooseFile(): string | null;
		get compileDate(): string;
		get platformName(): string;
		get shortVersion(): string;
		get version(): string;
		get buildVersion(): string;
		get args(): string[];
	}
}

declare module "*/artboardinterface.js" {
	import { HandleObject } from "*/handleobject.js";
	import { ArtboardProperties } from "*/artboardproperties.js";
	import { PhysicalRootInterface } from "*/physicalrootinterface.js";

	export class ArtboardInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		isSameObject(other: any): boolean;
		get isArtboardInterface(): boolean;
		get isArtboardEnabled(): boolean;
		set isArtboardEnabled(enabled: boolean);
		get description(): string;
		get baseBox(): any;
		get spreadBaseBox(): any;
		get topOfPageMargin(): number;
		get artboardProperties(): ArtboardProperties;
		get node(): any;
		get physicalRootInterface(): PhysicalRootInterface;
		get physicalRootProperties(): any;
		get pageCount(): number;
		setArtboardEnabled(enabled: boolean, preview?: boolean): any;
	}
}

declare module "*/artboardproperties.js" {
	import { HandleObject } from "*/handleobject.js";
	import { EffectiveMarginBehaviour } from "affinity:dom";

	export class ArtboardProperties extends HandleObject {
		get [Symbol.toStringTag](): string;
		get isArtboardProperties(): boolean;
		getMarginBox(behaviour: EffectiveMarginBehaviour): any;
		get marginFill(): any;
		get marginsInterface(): any;
		get physicalRootPropertiesInterface(): any;
		get node(): any;
	}
}

declare module "*/baseboxinterface.js" {
	import { HandleObject } from "*/handleobject.js";

	export class BaseBoxInterface extends HandleObject {
		get isBaseBoxInterface(): boolean;
		get baseBox(): any;
		get constrainingBaseBox(): any;
		getBaseBox(includeClips: boolean): any;
		getConstrainingBaseBox(includeClips: boolean): any;
		get node(): any;
	}
}

declare module "*/blendmodeinterface.js" {
	import { HandleObject } from "*/handleobject.js";
	import { BlendMode, AntialiasingMode } from "affinity:common";

	export class BlendOptions extends HandleObject {
		get [Symbol.toStringTag](): string;
		get isBlendOptions(): boolean;
		get gamma(): number;
		set gamma(value: number);
		get masterSourceLayerRanges(): any;
		set masterSourceLayerRanges(spline: any);
		get masterUnderlyingCompositionRanges(): any;
		set masterUnderlyingCompositionRanges(spline: any);
		getChannelSourceLayerRanges(channel: number): any;
		setChannelSourceLayerRanges(channel: number, spline: any): void;
		getChannelUnderlyingCompositionRanges(channel: number): any;
		setChannelUnderlyingCompositionRanges(channel: number, spline: any): void;
	}

	export class BlendModeInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get isBlendModeInterface(): boolean;
		get blendMode(): BlendMode;
		get blendOptions(): BlendOptions;
		get antialiasingMode(): AntialiasingMode;
		get node(): any;
		setBlendMode(blendMode: BlendMode, setPassthrough: boolean): any;
	}
}

declare module "*/brushfillinterface.js" {
	import { HandleObject } from "*/handleobject.js";
	import { ContentType } from "affinity:common";

	export class BrushFillInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get isBrushFillInterface(): boolean;
		get isNoFill(): boolean;
		getIsVisible(minAlpha: number): boolean;
		domainTransform(): any;
		get contentType(): ContentType;
		get descriptorCount(): number;
		getDescriptor(index: number, obeyScaleWithObject?: boolean): any;
		getCurrentDescriptor(obeyScaleWithObject?: boolean): any;
		get currentIndex(): number;
		enumerateDescriptors(callback: (desc: any) => void, obeyScaleWithObject?: boolean): any;
		get subSelectionCount(): number;
		getSubSelection(index: number): any;
		get node(): any;
		setCurrentDescriptor(fillDescriptorOrColour: any, options: any, preview: boolean): any;
		get currentDescriptor(): any;
		set currentDescriptor(fillDescriptorOrColour: any);
		getAllDescriptors(obeyScaleWithObject?: boolean): any[];
		get isAnchoredToSpread(): boolean;
		set isAnchoredToSpread(value: boolean);
		setIsAnchoredToSpread(anchored: boolean, applyToAllFills: boolean, preview: boolean): any;
		get fillDescriptor(): any;
		set fillDescriptor(fillDescriptorOrColour: any);
		get allDescriptors(): any[];
	}
}

declare module "*/document.js" {
	import { HandleObject } from "*/handleobject.js";
	import { BlendMode } from "affinity:common";

	export class Document extends HandleObject {
		static current: Document | null;
		get rootNode(): any;
		get dpi(): number;
		get sizePixels(): { width: number; height: number; };
		get widthPixels(): number;
		get heightPixels(): number;
		get layers(): any[];
		get spreads(): any[];
		get artboards(): any[];
		get hasArtboards(): boolean;
		get canUndo(): boolean;
		get canRedo(): boolean;
		get undoDescription(): string;
		get redoDescription(): string;
		get sessionUuid(): string;
		get persistentUuid(): string;

		static getCurrentAsync(callback: (errorCode: number, handle: any) => void): void;
		static loadAsync(path: string, callback: (errorCode: number, desc: string, handle: any) => void): void;

		enumerateSnapshots(callback: (index: number, name: string) => void): any;
		undo(): any;
		redo(): any;
		selectAll(selectOnCurrentLayerOnly: boolean, preview: boolean): any;
		deleteSelection(selection: any, preview: boolean): any;
		setEditable(editable: boolean, selection: any, preview: boolean): any;
		lockSelection(selection: any, preview: boolean): any;
		unlockSelection(selection: any, preview: boolean): any;
		setVisible(visible: boolean, selection: any, preview: boolean): any;
		setOpacity(opacity: number, selection: any, preview: boolean): any;
		setBlendMode(blendMode: BlendMode, setPassthrough: boolean, selection: any, preview: boolean): any;
		setTagColour(colour: string, selection: any, preview: boolean): any;
		setLayerDescription(description: string, selection: any, preview: boolean): any;
		convertToCurves(selection: any, preview: boolean): any;
		rasteriseObjects(selection: any, rasteriseContentsOnly: boolean, clipToSpread: boolean, preview: boolean): any;

		// Generative Imaging APIs discovered in Part 2 mapping
		generateImage(prompt: string): any;
		generativeEditImage(prompt: string): any;
		detectDepth(): any;
		colourise(): any;
		removeBackground(): any;
		selectSubject(): any;
	}
}

declare module "*/hatch.js" {
	import { HandleObject } from "*/handleobject.js";

	export class HatchLine extends HandleObject {
		get [Symbol.toStringTag](): string;
		clone(): HatchLine;
		static create(origin: any, rotation: number, step: number, pattern: any[]): HatchLine;
		get origin(): any;
		set origin(value: any);
		get rotation(): number;
		set rotation(value: number);
		get step(): number;
		set step(value: number);
		get patternDashCount(): number;
		getPatternDash(index: number): number;
		get pattern(): number[];
		set pattern(value: number[]);
		enumeratePattern(callback: (dash: number) => void): void;
		get isSolid(): boolean;
	}

	export class HatchPattern extends HandleObject {
		get [Symbol.toStringTag](): string;
		clone(): HatchPattern;
		static createEmpty(): HatchPattern;
		static createDefault(): HatchPattern;
		get hatchLineCount(): number;
		getHatchLine(index: number): HatchLine;
		enumerateHatchLines(callback: (line: HatchLine) => void): any;
		appendHatchLine(hatchLine: HatchLine): void;
		appendHatchLineData(origin: any, rotation: number, step: number, pattern: number[]): void;
		clearHatchLines(): void;
		eraseHatchLine(index: number): void;
		insertHatchLine(index: number, hatchLine: HandleObject): void;
	}
}

declare module "*/imageresourceinterface.js" {
	import { HandleObject } from "*/handleobject.js";
	import { FileType, ImagePlacement, RasterFormat } from "affinity:dom";

	export class ImageResourceInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get imageFilePath(): string;
		get imageFileSize(): number;
		get modifiedTime(): any;
		get fileType(): any;
		get fileTypeName(): string;
		get page(): number;
		get artboard(): any;
		get isOnArtboard(): boolean;
		get originalDPI(): number;
		get iccProfile(): string;
		get placedSize(): any;
		get originalSize(): any;
		getColourFormat(allowRemote: boolean): any;
		get imagePlacement(): any;
		get resourceNode(): any;
		get canEditOriginalImage(): boolean;
		saveOriginalFile(filename: string): boolean;
		get node(): any;
	}
}

declare module "*/layereffects.js" {
	import { HandleObject } from "*/handleobject.js";
	import { BlendMode } from "affinity:common";

	export class LayerEffect extends HandleObject {
		get [Symbol.toStringTag](): string;
		get isLayerEffect(): boolean;
		clone(): LayerEffect;
		get type(): any;
		get enabled(): boolean;
		set enabled(value: boolean);
		get opacity(): number;
		set opacity(value: number);
		get blendMode(): BlendMode;
		set blendMode(value: BlendMode);
		get scaleWithObject(): boolean;
		set scaleWithObject(value: boolean);
	}

	export class GaussianBlurLayerEffect extends LayerEffect {
		static create(): GaussianBlurLayerEffect;
		get radius(): number;
		set radius(value: number);
		get preserveAlpha(): boolean;
		set preserveAlpha(value: boolean);
	}

	export class ColourOverlayLayerEffect extends LayerEffect {
		static create(): ColourOverlayLayerEffect;
		get colour(): any;
		set colour(value: any);
	}
}

declare module "*/layereffectsinterface.js" {
	import { HandleObject } from "*/handleobject.js";
	import { LayerEffect } from "*/layereffects.js";

	export class LayerEffectsInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get effectCount(): number;
		getEffect(index: number): LayerEffect;
		enumerateEffects(callback: (effect: LayerEffect) => void): any;
		get effects(): LayerEffect[];
		get hasAnyVisibleEffects(): boolean;
		get hasActiveEffects(): boolean;
		get isScaleWithObject(): boolean;
		get node(): any;
	}
}

declare module "*/pixelaccessor.js" {
	import { HandleObject } from "*/handleobject.js";

	export interface BasePixelReader {
		readPixel(x: number, y: number): number[];
		dispose(): void;
	}

	export interface BasePixelReaderWriter extends BasePixelReader {
		writePixel(x: number, y: number, channels: number[]): void;
	}

	export class PixelReaderRGBA8 extends HandleObject implements BasePixelReader {
		readPixel(x: number, y: number): number[];
		dispose(): void;
		static create(bitmap: any): PixelReaderRGBA8;
	}

	export class PixelReaderWriterRGBA8 extends HandleObject implements BasePixelReaderWriter {
		readPixel(x: number, y: number): number[];
		writePixel(x: number, y: number, rgba8: number[]): void;
		dispose(): void;
		static create(bitmap: any): PixelReaderWriterRGBA8;
	}
}

declare module "*/physicalrootinterface.js" {
	import { HandleObject } from "*/handleobject.js";
	import { PhysicalRootPropertiesInterface } from "*/physicalrootpropertiesinterface.js";

	export class PhysicalRootInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get physicalRootProperties(): PhysicalRootPropertiesInterface;
		get node(): any;
	}
}

declare module "*/physicalrootpropertiesinterface.js" {
	import { HandleObject } from "*/handleobject.js";

	export class PhysicalRootPropertiesInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get pageCount(): number;
		get pageBoxInterface(): any;
		get node(): any;
	}
}

declare module "*/pictureframeinterface.js" {
	import { HandleObject } from "*/handleobject.js";
	import { SpatialAnchor } from "affinity:dom";

	export class PictureFrameInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get enabled(): boolean;
		get description(): string;
		get hasFrameContents(): boolean;
		get frameContents(): any;
		get anchor(): SpatialAnchor;
		get isClearFillOnPopulate(): boolean;
		get originalContentRectangle(): any;
		get dataMergeFieldId(): string;
		calculateAnchor(node: any, hint: any): any;
		get node(): any;
	}
}

declare module "*/taginterface.js" {
	import { HandleObject } from "*/handleobject.js";

	export class TagInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		hasKey(key: string): boolean;
		getValueForKey(key: string): any;
		get isMarkAsDecoration(): boolean;
		hasPredefinedKey(key: any): boolean;
		getValueForPredefinedKey(key: any): any;
		get node(): any;
	}
}

declare module "*/textframeinterface.js" {
	import { HandleObject } from "*/handleobject.js";

	export class TextFrameInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get canHideOverflow(): boolean;
		get canUseBaselineGrid(): boolean;
		get canUseTextWraps(): boolean;
		get hasScaledText(): boolean;
		get ignoreBaselineGrid(): boolean;
		get ignoreTextWraps(): boolean;
		get isMultiFrameTextFlow(): boolean;
		get isTextFlowBack(): boolean;
		get isTextFlowFront(): boolean;
		get isWrappingText(): boolean;
		get textBegin(): number;
		get textFlowIndex(): number;
		get textRenderScale(): number;
		get textUiScale(): number;
		get node(): any;
		get spreadNode(): any;
	}
}

declare module "*/timers.js" {
	import { HandleObject } from "*/handleobject.js";

	export class Timer extends HandleObject {
		static create(): Timer;
		cancel(): void;
		static cancelAll(): void;
		static get now(): bigint;
		get expiry(): number;
		set expiry(value: number);
		get expiryFromNow(): number;
		set expiryFromNow(value: number);
		waitAsync(callback: (errorCode: number) => void): void;
		dispose(): void;
	}

	export function setTimeout(delay: number, callback: (...args: any[]) => void, ...args: any[]): Timer;
	export function setInterval(delay: number, callback: (...args: any[]) => void, ...args: any[]): Timer;
	export function setImmediate(callback: (...args: any[]) => void, ...args: any[]): Timer;
}

declare module "*/transforminterface.js" {
	import { HandleObject } from "*/handleobject.js";

	export class TransformInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get transform(): any;
		getTransform(forceConstraints: boolean): any;
		get unconstrainedTransform(): any;
		get frameTextScale(): number;
		get prefersAspectRatioLockedResize(): boolean;
		get focalPoint(): any;
		get domainTransform(): any;
		get node(): any;
	}
}

declare module "*/transparencyinterface.js" {
	import { HandleObject } from "*/handleobject.js";
	import { ContentType } from "affinity:common";

	export class TransparencyInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get fillDescriptor(): any;
		get isTransparencyNone(): boolean;
		get domainTransform(): any;
		get contentType(): ContentType;
		get node(): any;
		get isAnchoredToSpread(): boolean;
		set isAnchoredToSpread(value: boolean);
		setIsAnchoredToSpread(anchored: boolean, applyToAllFills: boolean, preview: boolean): any;
	}
}

declare module "*/units.js" {
	import { HandleObject } from "*/handleobject.js";
	import { UnitType } from "affinity:common";

	export class UnitValueConverter extends HandleObject {
		static create(dpi: number, viewDpi?: number): UnitValueConverter;
		clone(): UnitValueConverter;
		get dpi(): number;
		get viewDpi(): number;
		getConversionFactor(from: UnitType, to: UnitType): number;
	}
}

declare module "*/vectorbrush.js" {
	import { HandleObject } from "*/handleobject.js";

	export class VectorBrush extends HandleObject {
		static createDefault(): VectorBrush;
		clone(): VectorBrush;
		get brushWidth(): number;
		set brushWidth(value: number);
		get sizeVariance(): number;
		set sizeVariance(value: number);
		get sizeControllerType(): any;
		set sizeControllerType(value: any);
		get opacityVariance(): number;
		set opacityVariance(value: number);
		get tailOffset(): number;
		set tailOffset(value: number);
		get headOffset(): number;
		set headOffset(value: number);
		get isRepeat(): boolean;
		set isRepeat(value: boolean);
		get cornerStrategy(): any;
		set cornerStrategy(value: any);
	}
}

declare module "*/visibilityinterface.js" {
	import { HandleObject } from "*/handleobject.js";

	export class VisibilityInterface extends HandleObject {
		get [Symbol.toStringTag](): string;
		get globalOpacity(): number;
		get fillOpacity(): number;
		get isVisible(): boolean;
		get isVisibleInExport(): boolean;
		get isVisibleInDomain(): boolean;
		testVisibility(options: any): boolean;
		get node(): any;
	}

	export class TextVisibilityOptions extends HandleObject {
		static create(): TextVisibilityOptions;
		clone(): TextVisibilityOptions;
		equals(other: any): boolean;
		anySet(): boolean;
		setNone(): void;
		get showSpecialCharacters(): boolean;
		set showSpecialCharacters(value: boolean);
		get showIndexMarks(): boolean;
		set showIndexMarks(value: boolean);
		get showAnchors(): boolean;
		set showAnchors(value: boolean);
		get showNoteMarks(): boolean;
		set showNoteMarks(value: boolean);
		get highlightFields(): boolean;
		set highlightFields(value: boolean);
	}
}

// Top-level environment context variables provided by sandbox
declare const environment: {
	activeDocument: any;
};

declare function alert(message: string, title?: string): void;
declare function confirm(message: string, title?: string): boolean;
declare function prompt(message: string, title?: string, initialText?: string): string | null;
