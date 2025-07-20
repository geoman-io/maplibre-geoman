import { GeoJSON, Feature, LineString, MultiLineString, Polygon, MultiPolygon, FeatureCollection, Point, MultiPoint, Position, BBox, GeoJsonProperties } from 'geojson';
import * as lodash from 'lodash';
import { PartialDeep, SetRequired } from 'type-fest';

declare abstract class BaseControl {
    gm: Geoman;
    constructor(gm: Geoman);
    abstract onAdd(): HTMLElement;
    abstract onRemove(): void;
}

declare class GMControl extends BaseControl {
    controls: SystemControls;
    reactiveControls: Record<string, unknown> | null;
    container: HTMLElement | undefined;
    mapEventHandlers: MapEventHandlers;
    onAdd(): HTMLElement;
    createControls(containerElement?: HTMLElement | undefined): void;
    onRemove(): void;
    handleModeEvent(event: AnyEvent): {
        next: boolean;
    };
    controlsAdded(): boolean;
    createReactivePanel(): void;
    updateReactivePanel(): void;
    createHtmlContainer(): HTMLDivElement;
    syncModeStates(): void;
    eachControlWithOptions(callback: ({ control }: {
        control: GenericSystemControl;
        controlOptions: ControlOptions;
    }) => void): void;
    getControl({ actionType, modeName }: {
        actionType: ActionType;
        modeName: ModeName;
    }): GenericSystemControl | null;
    getDefaultPosition(): BaseControlsPosition;
}

declare const gmSystemPrefix = "_gm";
declare class EventForwarder {
    gm: Geoman;
    globalEventsListener: GlobalEventsListener | null;
    constructor(gm: Geoman);
    get map(): object;
    processEvent(eventName: GmEventName, payload: GMEvent): void;
    forwardModeToggledEvent(payload: GMDrawModeEvent | GMEditModeEvent | GMHelperModeEvent): void;
    forwardFeatureCreated(payload: GMDrawShapeCreatedEvent): void;
    forwardFeatureRemoved(payload: GMEditFeatureRemovedEvent): void;
    forwardFeatureUpdated(payload: GMEditFeatureUpdatedEvent): void;
    forwardFeatureEditStart(payload: GMEditFeatureEditStartEvent): void;
    forwardFeatureEditEnd(payload: GMEditFeatureEditEndEvent): void;
    forwardGeomanLoaded(payload: GMControlLoadEvent): void;
    fireToMap(type: GlobalEventsListenerParameters['type'], eventName: GmEventNameWithoutPrefix | GmFwdEventName, payload: GlobalEventsListenerParameters['payload']): void;
    getConvertedEditModeName(mode: EditModeName): FwdEditModeName;
}

declare class EventBus {
    gm: Geoman;
    forwarder: EventForwarder;
    mapEventHandlers: MapEventHandlersWithControl;
    gmEventHandlers: GmEventHandlersWithControl;
    constructor(gm: Geoman);
    fireEvent(eventName: GmEventName, payload: GMEvent): void;
    attachEvents(handlers: MapEventHandlers): void;
    detachEvents(handlers: MapEventHandlers): void;
    detachAllEvents(): void;
    on(eventName: AnyEventName, handler: MapEventHadler | GmEventHadler): void;
    onGmEvent(eventName: GmEventName, handler: GmEventHadler): void;
    onMapEvent(eventName: MapEventName, handler: MapEventHadler): void;
    off(eventName: AnyEventName, handler: GmEventHadler | MapEventHadler): void;
    offGmEvent(eventName: GmEventName, handler: GmEventHadler): void;
    offMapEvent(eventName: MapEventName, handler: MapEventHadler): void;
    createEventSection(eventName: MapEventName | GmEventName): {
        handlers: never[];
        controlHandler: (event: AnyEvent) => void;
    };
}

declare const gmPrefix = "gm";
declare abstract class BaseEventListener$1 {
    gm: Geoman;
    protected constructor(gm: Geoman);
    trackExclusiveModes(payload: GMEvent): void;
    trackRelatedModes(payload: GMEvent): void;
    getControl(payload: GMDrawModeEvent | GMEditModeEvent | GMHelperModeEvent | GMControlSwitchEvent): GenericSystemControl | null;
    getControlOptions(payload: GMDrawModeEvent | GMEditModeEvent | GMHelperModeEvent | GMControlSwitchEvent): ControlOptions | null;
    getControlIds(payload: GMDrawModeEvent | GMEditModeEvent | GMHelperModeEvent | GMControlSwitchEvent): {
        sectionName: "draw" | "edit" | "helper";
        modeName: ModeName;
    } | null;
}

declare abstract class BaseSource<TSourceInstance = unknown> {
    abstract sourceInstance: TSourceInstance | null;
    abstract createSource({ geoJson, sourceId }: {
        sourceId: string;
        geoJson: GeoJSON;
    }): TSourceInstance;
    abstract get id(): string;
    abstract getGeoJson(): GeoJsonShapeFeatureCollection;
    abstract setGeoJson(geoJson: GeoJSON): void;
    abstract updateData(updateStorage: GeoJsonDiffStorage): void;
    abstract remove({ removeLayers }: {
        removeLayers: boolean;
    }): void;
    isInstanceAvailable(): this is {
        sourceInstance: TSourceInstance;
    };
}

declare class FeatureData {
    gm: Geoman;
    id: FeatureId;
    parent: FeatureData | null;
    shape: FeatureShape;
    markers: Map<MarkerId, MarkerData>;
    shapeProperties: FeatureShapeProperties;
    source: BaseSource;
    orders: FeatureOrders;
    constructor(parameters: FeatureDataParameters);
    get order(): FeatureOrder;
    set order(order: FeatureOrder);
    getEmptyOrders(): FeatureOrders;
    get temporary(): boolean;
    get sourceName(): FeatureSourceName;
    getFreeOrder(): number;
    getGeoJson(): GeoJsonShapeFeatureWithGmProperties;
    getShapeProperty(name: keyof FeatureShapeProperties): LngLat | null;
    setShapeProperty<T extends keyof FeatureShapeProperties>(name: T, value: FeatureShapeProperties[T]): void;
    getSourceGeoJson(): GeoJsonShapeFeatureCollection;
    addGeoJson(geoJson: GeoJsonShapeFeature): void;
    removeGeoJson(): void;
    removeMarkers(): void;
    updateGeoJsonGeometry(geometry: BasicGeometry): void;
    updateGeoJsonProperties(properties: Partial<ShapeGeoJsonProperties>): void;
    updateGeoJsonCenter(geoJson: GeoJsonShapeFeature): void;
    convertToPolygon(): boolean;
    isConvertableToPolygon(): boolean;
    fixOrder(): void;
    isFeatureAvailable(): this is {
        order: number;
    };
    changeSource({ sourceName, atomic }: {
        sourceName: FeatureSourceName;
        atomic: boolean;
    }): void;
    actualChangeSource({ sourceName, atomic }: {
        sourceName: FeatureSourceName;
        atomic: boolean;
    }): void;
    delete(): void;
}

declare abstract class BaseDomMarker<TMarkerInstance = unknown> {
    abstract markerInstance: TMarkerInstance | null;
    abstract getElement(): HTMLElement | null;
    abstract setLngLat(lngLat: LngLat): void;
    abstract getLngLat(): LngLat;
    abstract remove(): void;
    isMarkerInstanceAvailable(): this is {
        markerInstance: TMarkerInstance;
    };
}

declare const helperModes: readonly ["shape_markers", "pin", "snapping", "snap_guides", "measurements", "auto_trace", "geofencing", "zoom_to_features", "click_to_edit"];
declare abstract class BaseHelper extends BaseAction {
    actionType: ActionType;
    abstract mode: HelperModeName;
}

type ShapeSnappingHandler = (featureData: FeatureData, lngLat: LngLat, point: ScreenPoint) => {
    lngLat: LngLat;
    distance: number;
};
declare class SnappingHelper extends BaseHelper {
    mode: HelperModeName;
    tolerance: number;
    private excludedFeature;
    private customSnappingLngLats;
    private customSnappingFeatures;
    lineSnappingShapes: ReadonlyArray<FeatureShape>;
    mapEventHandlers: {};
    shapeSnappingHandlers: {
        [key in FeatureShape]?: ShapeSnappingHandler;
    };
    onStartAction(): void;
    onEndAction(): void;
    addExcludedFeature(featureData: FeatureData): void;
    clearExcludedFeatures(): void;
    addCustomSnappingFeature(featureData: FeatureData): void;
    removeCustomSnappingFeature(featureData: FeatureData): void;
    clearCustomSnappingFeature(): void;
    setCustomSnappingCoordinates(sectionKey: string, lngLats: Array<LngLat>): void;
    clearCustomSnappingCoordinates(sectionKey: string): void;
    getSnappedLngLat(lngLat: LngLat, point: ScreenPoint): LngLat;
    getCustomLngLatsSnapping(point: ScreenPoint): LngLat | null;
    getFeaturePointsSnapping(features: Array<FeatureData>, lngLat: LngLat, point: ScreenPoint): LngLat | null;
    getFeatureLinesSnapping(features: Array<FeatureData>, lngLat: LngLat, point: ScreenPoint): LngLat | null;
    getFeaturesInPointBounds(point: ScreenPoint): Array<FeatureData>;
    getPointsSnapping(featureData: FeatureData, lngLat: LngLat, point: ScreenPoint): ReturnType<ShapeSnappingHandler>;
    getLineSnapping(featureData: FeatureData, lngLat: LngLat, point: ScreenPoint): ReturnType<ShapeSnappingHandler>;
    getNearestLinePointData(lineGeoJson: Feature<LineString | MultiLineString>, lngLat: LngLat, point: ScreenPoint): {
        lngLat: LngLat;
        distance: number;
    };
}

declare const actionTypes: readonly ["draw", "edit", "helper"];
declare abstract class BaseAction {
    gm: Geoman;
    abstract actionType: ActionType;
    abstract mode: ModeName;
    options: ActionOptions;
    actions: SubActions;
    flags: {
        featureCreateAllowed: boolean;
        featureUpdateAllowed: boolean;
    };
    abstract mapEventHandlers: MapEventHandlers;
    internalMapEventHandlers: MapEventHandlers;
    constructor(gm: Geoman);
    abstract onStartAction(): void;
    abstract onEndAction(): void;
    startAction(): void;
    endAction(): void;
    get snappingHelper(): SnappingHelper | null;
    getOptionValue(name: string): string | number | boolean;
    applyOptionValue(name: string, value: boolean | string | number): void;
    handleHelperEvent(event: AnyEvent): {
        next: boolean;
    };
    handleGeofencingViolationEvent(event: GMGeofencingViolationEvent): {
        next: boolean;
    };
    fireBeforeFeatureCreate({ geoJsonFeatures, forceMode }: {
        geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
        forceMode?: EditModeName;
    }): void;
    fireBeforeFeatureUpdate({ features, geoJsonFeatures, forceMode }: {
        features: NonEmptyArray<FeatureData>;
        geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
        forceMode?: EditModeName;
    }): void;
}

declare const shapeNames: readonly ["marker", "circle", "circle_marker", "text_marker", "line", "rectangle", "polygon"];
declare const extraDrawModes: readonly ["freehand", "custom_shape"];
declare const drawModes: readonly ["marker", "circle", "circle_marker", "text_marker", "line", "rectangle", "polygon", "freehand", "custom_shape"];
declare abstract class BaseDraw extends BaseAction {
    actionType: ActionType;
    abstract mode: DrawModeName;
    shape: ShapeName | null;
    featureData: FeatureData | null;
    saveFeature(): void;
    removeTmpFeature(): void;
    fireMarkerPointerStartEvent(): void;
    fireMarkerPointerUpdateEvent(): void;
    fireMarkerPointerFinishEvent(): void;
    forwardLineDrawerEvent(payload: GMEvent): {
        next: boolean;
    };
}

declare const editModes: readonly ["drag", "change", "rotate", "scale", "copy", "cut", "split", "union", "difference", "line_simplification", "lasso", "delete"];
declare abstract class BaseEdit extends BaseAction {
    actionType: ActionType;
    abstract mode: EditModeName;
    featureData: FeatureData | null;
    cursorExcludedLayerIds: Array<string>;
    layerEventHandlersData: Array<{
        eventName: PointerEventName;
        layerId: string;
        callback: () => void;
    }>;
    startAction(): void;
    endAction(): void;
    setCursorToPointer(): void;
    setCursorToEmpty(): void;
    setEventsForLayers(eventName: PointerEventName, callback: () => void): void;
    clearEventsForLayers(): void;
    updateFeatureGeoJson({ featureData, featureGeoJson, forceMode }: {
        featureData: FeatureData;
        featureGeoJson: GeoJsonShapeFeature;
        forceMode?: EditModeName;
    }): boolean;
    fireFeatureUpdatedEvent({ sourceFeatures, targetFeatures, markerData, forceMode }: {
        sourceFeatures: NonEmptyArray<FeatureData>;
        targetFeatures: NonEmptyArray<FeatureData>;
        markerData?: MarkerData;
        forceMode?: EditModeName;
    }): void;
    fireFeatureEditStartEvent({ feature, forceMode }: {
        feature: FeatureData;
        forceMode?: EditModeName;
    }): void;
    fireFeatureEditEndEvent({ feature, forceMode }: {
        feature: FeatureData;
        forceMode?: EditModeName;
    }): void;
    fireMarkerPointerUpdateEvent(): void;
    forwardLineDrawerEvent(payload: GMEvent): {
        next: boolean;
    };
    fireFeatureRemovedEvent(featureData: FeatureData): void;
    getLineDrawerMode(): DrawModeName;
}

declare abstract class BaseLayer<TLayerInstance = unknown> {
    abstract layerInstance: TLayerInstance | null;
    abstract get id(): string;
    abstract get source(): string;
    abstract createLayer(options: unknown): TLayerInstance;
    abstract remove(): void;
    isInstanceAvailable(): this is {
        layerInstance: TLayerInstance;
    };
}

declare const SOURCES: {
    readonly main: "gm_main";
    readonly temporary: "gm_temporary";
    readonly standby: "gm_standby";
};
declare const FEATURE_ID_PROPERTY: "_gmid";
declare class Features {
    gm: Geoman;
    featureCounter: number;
    featureStore: FeatureStore;
    featureStoreAllowedSources: Array<FeatureSourceName>;
    autoUpdatesEnabled: boolean;
    diffUpdatesEnabled: boolean;
    sources: SourcesStorage;
    defaultSourceName: FeatureSourceName;
    updateStorage: UpdateStorage;
    delayedSourceUpdateMethods: SourceUpdateMethods;
    layers: Array<BaseLayer>;
    constructor(gm: Geoman);
    init(): void;
    get forEach(): (callbackfn: ForEachFeatureDataCallbackFn) => void;
    get tmpForEach(): (callbackfn: ForEachFeatureDataCallbackFn) => void;
    getNewFeatureId(): FeatureId;
    filteredForEach(filterFn: (featureData: FeatureData) => boolean): (callbackfn: ForEachFeatureDataCallbackFn) => void;
    has(sourceName: keyof SourcesStorage, featureId: FeatureId): boolean;
    get(sourceName: keyof SourcesStorage, featureId: FeatureId): FeatureData | null;
    add(featureData: FeatureData): void;
    setDefaultSourceName(sourceName: FeatureSourceName): void;
    getDelayedSourceUpdateMethod({ sourceName, type }: {
        sourceName: FeatureSourceName;
        type: 'throttled' | 'debounced';
    }): lodash.DebouncedFunc<() => void>;
    updateSourceByStorage(sourceName: FeatureSourceName): void;
    resetDiffStorage(sourceName: FeatureSourceName): void;
    withAtomicSourcesUpdate<T>(callback: () => T): T;
    updateSourceData({ diff, sourceName }: {
        diff: GeoJsonSourceDiff;
        sourceName: FeatureSourceName;
    }): void;
    updateSourceDataWithDiff({ diff, sourceName }: {
        diff: GeoJsonSourceDiff;
        sourceName: FeatureSourceName;
    }): void;
    setSourceData({ sourceName }: {
        diff: GeoJsonSourceDiff;
        sourceName: FeatureSourceName;
    }): void;
    createSource(sourceName: FeatureSourceName): BaseSource<unknown>;
    delete(featureIdOrFeatureData: FeatureData | FeatureId): void;
    getFeatureByMouseEvent({ event, sourceNames }: {
        event: AnyEvent;
        sourceNames: Array<FeatureSourceName>;
    }): FeatureData | null;
    getFeaturesByGeoJsonBounds({ geoJson, sourceNames }: {
        geoJson: Feature<Polygon | MultiPolygon | LineString>;
        sourceNames: Array<FeatureSourceName>;
    }): Array<FeatureData>;
    getFeaturesByScreenBounds({ bounds, sourceNames }: {
        bounds: [ScreenPoint, ScreenPoint];
        sourceNames: Array<FeatureSourceName>;
    }): FeatureData[];
    createFeature({ featureId, shapeGeoJson, parent, sourceName, imported }: {
        featureId?: FeatureId;
        shapeGeoJson: GeoJsonShapeFeature;
        parent?: FeatureData;
        sourceName: FeatureSourceName;
        imported?: boolean;
    }): FeatureData | null;
    importGeoJson(geoJson: GeoJsonImportFeatureCollection | GeoJsonImportFeature): {
        stats: {
            total: number;
            success: number;
            failed: number;
        };
        addedFeatures: Array<FeatureData>;
    };
    importGeoJsonFeature(shapeGeoJson: GeoJsonImportFeature): FeatureData | null;
    getAll(): FeatureCollection;
    exportGeoJson({ allowedShapes }?: {
        allowedShapes?: Array<FeatureShape>;
    }): GeoJsonShapeFeatureCollection;
    getSourceGeoJson(sourceName: FeatureSourceName): GeoJsonShapeFeatureCollection;
    setSourceGeoJson({ geoJson, sourceName }: {
        geoJson: GeoJSON;
        sourceName: FeatureSourceName;
    }): void;
    asGeoJsonFeatureCollection({ shapeTypes, sourceNames }: {
        shapeTypes?: Array<FeatureShape>;
        sourceNames: Array<FeatureSourceName>;
    }): GeoJsonShapeFeatureCollection;
    convertSourceToGm(inputSource: BaseSource): Array<FeatureData>;
    addGeoJsonFeature({ shapeGeoJson, sourceName, defaultSource }: {
        shapeGeoJson: GeoJsonImportFeature;
        sourceName?: FeatureSourceName;
        defaultSource?: boolean;
    }): FeatureData | null;
    createLayers(): Array<BaseLayer>;
    createGenericLayer({ layerId, sourceName, partialStyle, shape }: {
        layerId: string;
        partialStyle: PartialLayerStyle;
        shape: FeatureShape;
        sourceName: FeatureSourceName;
    }): BaseLayer | null;
    getFeatureShapeByGeoJson(shapeGeoJson: GeoJsonImportFeature): ShapeName | null;
    createMarkerFeature({ parentFeature, coordinate, type, sourceName }: {
        type: MarkerData['type'];
        coordinate: LngLat;
        parentFeature: FeatureData;
        sourceName: FeatureSourceName;
    }): FeatureData | null;
    updateMarkerFeaturePosition(markerFeatureData: FeatureData, coordinates: LngLat): void;
    fireFeatureCreatedEvent(featureData: FeatureData): void;
}

type FwdEditModeName = EditModeName | 'edit';
interface FeatureEditStartFwdEvent {
    shape: FeatureShape;
    feature: FeatureData;
    map: AnyMapInstance;
}
type FeatureEditEndFwdEvent = FeatureEditStartFwdEvent;
type FeatureEditFwdEvent = FeatureEditStartFwdEvent | FeatureEditEndFwdEvent;

interface FeatureCreatedFwdEvent {
    shape: DrawModeName;
    feature: FeatureData;
    map: AnyMapInstance;
}
type FeatureRemovedFwdEvent = FeatureCreatedFwdEvent;
interface FeatureUpdatedFwdEvent {
    map: AnyMapInstance;
    shape?: FeatureShape;
    feature?: FeatureData;
    features?: Array<FeatureData>;
    originalFeature?: FeatureData;
    originalFeatures?: Array<FeatureData>;
}
type FeatureFwdEvent = FeatureCreatedFwdEvent | FeatureRemovedFwdEvent | FeatureUpdatedFwdEvent;

interface GlobalDrawToggledFwdEvent {
    enabled: boolean;
    shape: DrawModeName;
    map: AnyMapInstance;
}
interface GlobalDrawEnabledDisabledFwdEvent {
    shape: DrawModeName;
    map: AnyMapInstance;
}
interface GlobalEditToggledFwdEvent {
    enabled: boolean;
    map: AnyMapInstance;
}
type GlobalModeToggledFwdEvent = GlobalDrawToggledFwdEvent | GlobalEditToggledFwdEvent | GlobalDrawEnabledDisabledFwdEvent;

interface GmLoadedFwdEvent {
    map: AnyMapInstance;
    [gmPrefix]: Geoman;
}
type SystemFwdEvent = GmLoadedFwdEvent;

type GmSystemPrefix = typeof gmSystemPrefix;
type GmFwdEventNameWithPrefix = `${GmPrefix}:${GmFwdEventName}`;
type GmFwdSystemEventNameWithPrefix = `${GmSystemPrefix}:${GmEventNameWithoutPrefix}`;
type GlobalEventsListenerParameters = {
    type: 'system' | 'converted';
    name: GmFwdEventNameWithPrefix | GmFwdSystemEventNameWithPrefix;
    payload: GmFwdEvent | GMEvent;
};
type GlobalEventsListener = (parameters: GlobalEventsListenerParameters) => void;
type GmFwdEventName = 'globaldrawmodetoggled' | 'drawstart' | 'drawend' | `global${FwdEditModeName}modetoggled` | `global${HelperModeName}modetoggled` | 'create' | 'remove' | FwdEditModeName | `${FwdEditModeName}start` | `${FwdEditModeName}end` | GMControlLoadEvent['action'];
type GmFwdEvent = SystemFwdEvent | GlobalModeToggledFwdEvent | FeatureFwdEvent | FeatureEditFwdEvent;

declare const styles: {
    [key in FeatureShape]: LayerStyle;
};

type ActionType = typeof actionTypes[number];
interface ControlOptions {
    title: string;
    icon: string | null;
    uiEnabled: boolean;
    active: boolean;
    options?: ActionOptions;
}
type GmOptionsData = {
    settings: {
        throttlingDelay: number;
        controlsPosition: BaseControlsPosition;
    };
    layerStyles: typeof styles;
    controls: {
        draw: {
            [key in DrawModeName]?: ControlOptions;
        };
        edit: {
            [key in EditModeName]?: ControlOptions;
        };
        helper: {
            [key in HelperModeName]?: ControlOptions;
        };
    };
};
type GmOptionsPartial = PartialDeep<GmOptionsData>;
type GenericControlsOptions = {
    [key in ModeName]?: ControlOptions;
};

type StyleVariables = {
    lineColor: string;
    lineOpacity: number;
    lineWidth: number;
    fillColor: string;
    fillOpacity: number;
    circleMarkerRadius: number;
};
interface PartialCircleLayer {
    type: 'circle';
    paint?: {
        'circle-radius'?: number;
        'circle-color'?: string;
        'circle-opacity'?: number;
        'circle-stroke-width'?: number;
        'circle-stroke-color'?: string;
        'circle-stroke-opacity'?: number;
    };
}
interface PartialLineLayer {
    type: 'line';
    paint?: {
        'line-color'?: string;
        'line-width'?: number;
        'line-opacity'?: number;
        'line-dasharray'?: number[];
    };
    layout?: {
        'line-cap'?: 'butt' | 'round' | 'square';
        'line-join'?: 'bevel' | 'round' | 'miter';
    };
}
interface PartialFillLayer {
    type: 'fill';
    paint?: {
        'fill-color'?: string;
        'fill-opacity'?: number;
        'fill-outline-color'?: string;
        'fill-antialias'?: boolean;
    };
}
interface PartialSymbolLayer {
    type: 'symbol';
    layout?: {
        'icon-image'?: string;
        'icon-size'?: number;
        'icon-allow-overlap'?: boolean;
        'icon-anchor'?: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
        'text-field'?: string[];
        'text-size'?: number;
        'text-justify'?: 'auto' | 'left' | 'center' | 'right';
        'text-anchor'?: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    };
    paint?: {
        'text-color'?: string;
        'text-opacity'?: number;
        'text-halo-color'?: string;
        'text-halo-width'?: number;
    };
}
type PartialLayerStyle = PartialLineLayer | PartialFillLayer | PartialCircleLayer | PartialSymbolLayer;
type SourceStyles = Record<keyof SourcesStorage, StyleVariables>;
type LayerStyle = Record<keyof SourcesStorage, Array<PartialLayerStyle>>;

type LngLat = [number, number];
type ScreenPoint = [number, number];
declare const pointerEvents: readonly ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "contextmenu", "touchstart", "touchend", "touchmove", "touchcancel"];
type PointerEventName = typeof pointerEvents[number];
declare const baseMapEventNames: readonly ["load"];
type BaseMapEventName = typeof baseMapEventNames[number];
declare const gmServiceEventNames: readonly ["loaded"];
type GmServiceEventName = typeof gmServiceEventNames[number];
type GmServiceEventNameWithPrefix = `${GmPrefix}:${GmServiceEventName}`;
type MapEventName = PointerEventName | BaseMapEventName;
type AnyEventName = GmEventName | MapEventName | GmFwdEventNameWithPrefix | GmFwdSystemEventNameWithPrefix | GmServiceEventNameWithPrefix;
type AnyEvent = MapEvent | GMEvent;
type BaseEventListener = (event: AnyEvent) => void;
type MapEvent = unknown;
type MapPointerEvent = {
    type: PointerEventName;
    originalEvent: MouseEvent;
    point: {
        x: number;
        y: number;
    };
    lngLat: {
        lng: number;
        lat: number;
        toArray(): LngLat;
    };
};
type GeoJsonFeatureData = {
    id: FeatureId | undefined;
    sourceName: FeatureSourceName;
    geoJson: GeoJsonImportFeature;
};
type MapTypes = {
    maplibre: object;
};
type AnyMapInstance = MapTypes[keyof MapTypes];
type BaseControlsPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type CursorType = 'move' | 'pointer' | 'grab' | 'crosshair' | '';
type MapInstanceWithGeoman<T = AnyMapInstance> = {
    gm: Geoman;
} & T;
type GeoJsonSourceDiff = {
    remove?: Array<FeatureId>;
    add?: Array<Feature>;
    update?: Array<Feature>;
};
type GeoJsonDiffStorage = {
    add: Array<Feature>;
    update: Array<Feature>;
    remove: Array<FeatureId>;
};
type BaseFitBoundsOptions = {
    padding?: number;
};
type AnchorPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type BaseDomMarkerOptions = {
    element: HTMLElement;
    draggable?: boolean;
    anchor?: AnchorPosition;
};
type BasePopupOptions = {
    offset: number;
    closeOnClick: boolean;
    closeButton: boolean;
    focusAfterOpen: boolean;
    anchor: AnchorPosition;
    className: string;
};
interface MapWithOnceMethod {
    once(type: string, listener: (ev: unknown) => void): this;
}
declare const mapInteractions: readonly ["scrollZoom", "boxZoom", "dragRotate", "dragPan", "keyboard", "doubleClickZoom", "touchZoomRotate", "touchPitch"];
type MapInteraction = typeof mapInteractions[number];

type FeatureId = number | string;
type ShapeGeoJsonProperties = {
    shape: FeatureShape;
    [FEATURE_ID_PROPERTY]?: FeatureId;
    center?: LngLat;
    text?: string;
    [key: string]: unknown;
};
type FeatureDataParameters = {
    gm: Geoman;
    id: FeatureId;
    parent: FeatureData | null;
    source: BaseSource;
    geoJsonShapeFeature: GeoJsonShapeFeature;
};
type FeatureOrder = number | null;
type FeatureSourceName = typeof SOURCES[keyof typeof SOURCES];
type SourcesStorage = {
    [key in FeatureSourceName]: BaseSource | null;
};
type UpdateStorage = {
    [key in FeatureSourceName]: GeoJsonDiffStorage;
};
type SourceUpdateMethods = {
    [key in FeatureSourceName]: {
        debounced: () => void;
        throttled: () => void;
    };
};
type FeatureStore = Map<FeatureId, FeatureData>;
type ForEachFeatureDataCallbackFn = (value: FeatureData, key: FeatureId, map: FeatureStore) => void;
type FeatureOrders = Record<FeatureSourceName, FeatureOrder>;
type FeatureShapeProperties = {
    center: LngLat | null;
};
type FeatureShape = ShapeName | `${MarkerData['type']}_marker` | 'snap_guide';

type ImportGeoJsonProperties = {
    shape?: ShapeName;
    center?: LngLat;
    radius?: number;
    text?: string;
    [key: string]: unknown;
};
type PointBasedGeometry = Point | MultiPoint;
type LineBasedGeometry = LineString | MultiLineString | Polygon | MultiPolygon;
type BasicGeometry = PointBasedGeometry | LineBasedGeometry;
type GeoJsonShapeFeature = Feature<BasicGeometry, ShapeGeoJsonProperties>;
type GeoJsonImportFeature = Feature<BasicGeometry, ImportGeoJsonProperties>;
type GeoJsonLineFeature = Feature<LineString, ShapeGeoJsonProperties>;
type GeoJsonShapeFeatureCollection = FeatureCollection<BasicGeometry, ShapeGeoJsonProperties>;
type GeoJsonImportFeatureCollection = FeatureCollection<BasicGeometry, ImportGeoJsonProperties>;
type GeoJsonShapeFeatureWithGmProperties = Omit<GeoJsonShapeFeature, 'properties'> & {
    properties: SetRequired<GeoJsonShapeFeature['properties'], '_gmid'>;
};
type LngLatDiff = {
    lng: number;
    lat: number;
};
interface PositionData {
    coordinate: LngLat;
    path: Array<string | number>;
}
type SegmentPosition = {
    start: PositionData;
    end: PositionData;
};
type CoordinateIndices = {
    absCoordIndex: number;
    featureIndex: number;
    multiFeatureIndex: number;
    geometryIndex: number;
};

type LineEventHandlerArguments = {
    markerIndex: number;
    shapeCoordinates: Array<Position>;
    geoJson: GeoJsonLineFeature;
    bounds: [LngLat, LngLat];
};

type ActionInstanceKey = `${ActionType}__${ModeName}`;
type ActionInstance = ReturnType<Geoman['createDrawInstance'] | Geoman['createEditInstance'] | Geoman['createHelperInstance']>;
type ShapeName = typeof shapeNames[number];
type DrawModeName = typeof drawModes[number];
type ExtraDrawModeName = typeof extraDrawModes[number];
type EditModeName = typeof editModes[number];
type HelperModeName = typeof helperModes[number];
type ChoiceItem = {
    title: string;
    value: boolean | string | number;
};
type SelectActionOption = {
    type: 'select';
    label: string;
    name: string;
    value: ChoiceItem;
    choices: Array<ChoiceItem>;
};
type ToggleActionOption = {
    type: 'toggle';
    label: string;
    name: string;
    value: boolean;
};
type SubAction = {
    label: string;
    name: string;
    method: () => void;
};
type ActionOption = SelectActionOption | ToggleActionOption;
type ActionOptions = Array<ActionOption>;
type SubActions = Array<SubAction>;
type MarkerId = string;
interface DomMarkerData {
    type: 'dom';
    instance: BaseDomMarker;
    position: PositionData;
}
interface VertexMarkerData {
    type: 'vertex';
    instance: FeatureData;
    position: PositionData;
}
interface CenterMarkerData {
    type: 'center';
    instance: FeatureData;
    position: PositionData;
}
interface EdgeMarkerData {
    type: 'edge';
    instance: FeatureData;
    position: PositionData;
    segment: {
        start: PositionData;
        end: PositionData;
    };
}
type MarkerData = DomMarkerData | VertexMarkerData | CenterMarkerData | EdgeMarkerData;

interface ControlSettings {
    exclusive: boolean;
    enabledBy?: Array<ModeName>;
}
interface SystemControl<AT extends ActionType, Mode> {
    readonly type: AT;
    readonly targetMode: Mode;
    readonly eventType: 'toggle' | 'click';
    readonly settings: ControlSettings;
}
interface SystemControls {
    readonly draw: Record<DrawModeName, SystemControl<'draw', DrawModeName>>;
    readonly edit: Record<EditModeName, SystemControl<'edit', EditModeName>>;
    readonly helper: Record<HelperModeName, SystemControl<'helper', HelperModeName>>;
}
type ModeName = DrawModeName | EditModeName | HelperModeName;
type GenericSystemControl = SystemControl<ActionType, ModeName>;
type GenericSystemControls = {
    [key in ModeName]?: GenericSystemControl;
};

declare const controlActions: readonly ["on", "off"];
interface GMControlSwitchEvent extends GMBaseEvent {
    type: 'control';
    action: typeof controlActions[number];
    section: ActionType;
    target: ModeName;
}
interface GMControlLoadEvent extends GMBaseEvent {
    type: 'control';
    action: 'loaded' | 'unloaded';
}
type GMControlEvent = GMControlSwitchEvent | GMControlLoadEvent;

declare const modeActions: readonly ["mode_start", "mode_started", "mode_end", "mode_ended"];
type ModeAction = typeof modeActions[number];
interface GmBaseModeEvent extends GMBaseEvent {
    action: ModeAction;
}

interface GMDrawModeEvent extends GmBaseModeEvent {
    type: 'draw';
    mode: DrawModeName;
}
interface GMDrawShapeEvent extends GMBaseEvent {
    type: 'draw';
    mode: DrawModeName;
    variant: null;
    action: 'finish' | 'cancel';
}
interface GMDrawShapeEventWithData extends GMBaseEvent {
    type: 'draw';
    mode: DrawModeName;
    variant: null;
    action: 'start' | 'update' | 'finish';
    markerData: MarkerData | null;
    featureData: FeatureData | null;
}
interface GMDrawShapeCreatedEvent extends GMBaseEvent {
    type: 'draw';
    mode: DrawModeName;
    action: 'feature_created';
    featureData: FeatureData;
}
type GMDrawLineDrawerEvent = Omit<GMDrawShapeEvent, 'mode' | 'variant'> & {
    mode: 'line';
    variant: 'line_drawer';
};
type GMDrawFreehandDrawerEvent = Omit<GMDrawShapeEvent, 'mode' | 'variant'> & {
    mode: 'line' | 'polygon';
    variant: 'freehand_drawer';
};
type GMDrawLineDrawerEventWithData = Omit<GMDrawShapeEventWithData, 'mode' | 'variant'> & {
    mode: 'line';
    variant: 'line_drawer';
    geoJsonFeature?: GeoJsonLineFeature;
};
type GMDrawFreehandDrawerEventWithData = Omit<GMDrawShapeEventWithData, 'mode' | 'variant'> & {
    mode: 'line' | 'polygon';
    variant: 'freehand_drawer';
};
type GMDrawEvent = GMDrawModeEvent | GMDrawShapeEvent | GMDrawShapeEventWithData | GMDrawLineDrawerEvent | GMDrawLineDrawerEventWithData | GMDrawFreehandDrawerEvent | GMDrawFreehandDrawerEventWithData | GMDrawShapeCreatedEvent;

interface GMEditModeEvent extends GmBaseModeEvent {
    type: 'edit';
    mode: EditModeName;
}
interface GMEditMarkerMoveEvent extends GMBaseEvent {
    type: 'edit';
    mode: EditModeName;
    action: 'marker_move';
    featureData: FeatureData;
    markerData: MarkerData;
    lngLatStart: LngLat;
    lngLatEnd: LngLat;
}
interface GMEditMarkerEvent extends GMBaseEvent {
    type: 'edit';
    mode: EditModeName;
    action: 'edge_marker_click' | 'marker_right_click' | 'marker_captured' | 'marker_released';
    featureData: FeatureData;
    markerData: MarkerData;
}
interface GMEditFeatureRemovedEvent extends GMBaseEvent {
    type: 'edit';
    mode: DrawModeName;
    action: 'feature_removed';
    featureData: FeatureData;
}
interface GMEditFeatureUpdatedEvent extends GMBaseEvent {
    type: 'edit';
    mode: EditModeName;
    action: 'feature_updated';
    sourceFeatures: NonEmptyArray<FeatureData>;
    targetFeatures: NonEmptyArray<FeatureData>;
    markerData: MarkerData | null;
}
interface GMEditFeatureEditStartEvent extends GMBaseEvent {
    type: 'edit';
    mode: EditModeName;
    action: 'feature_edit_start';
    feature: FeatureData;
}
interface GMEditFeatureEditEndEvent extends GMBaseEvent {
    type: 'edit';
    mode: EditModeName;
    action: 'feature_edit_end';
    feature: FeatureData;
}
type GMEditEvent = GMEditModeEvent | GMEditMarkerEvent | GMEditMarkerMoveEvent | GMEditFeatureUpdatedEvent | GMEditFeatureEditStartEvent | GMEditFeatureEditEndEvent | GMEditFeatureRemovedEvent;

interface GMBeforeFeatureCreateEvent extends GMBaseEvent {
    type: ActionType;
    mode: ModeName;
    action: 'before_create';
    geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
}
interface GMBeforeFeatureUpdateEvent extends GMBaseEvent {
    type: ActionType;
    mode: ModeName;
    action: 'before_update';
    features: NonEmptyArray<FeatureData>;
    geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
}
type GMFeatureEvent = GMBeforeFeatureUpdateEvent | GMBeforeFeatureCreateEvent;

interface GMHelperModeEvent extends GmBaseModeEvent {
    type: 'helper';
    mode: HelperModeName;
}
declare const geofencingViolationActions: readonly ["intersection_violation", "containment_violation"];
interface GMGeofencingViolationEvent extends GMBaseEvent {
    mode: 'geofencing';
    actionType: ActionType;
    action: typeof geofencingViolationActions[number];
}
type GMHelperEvent = GMHelperModeEvent | GMGeofencingViolationEvent;

type MapHandlerReturnData = {
    next: boolean;
};
type MapEventHadler = (event: MapEvent) => MapHandlerReturnData;
type GmEventHadler = (event: GMEvent) => MapHandlerReturnData;
type MapEventHandlers = {
    [key in AnyEventName]?: GmEventHadler | MapEventHadler;
};
type MapEventHandlersWithControl = {
    [key in MapEventName]?: {
        controlHandler: (event: AnyEvent) => void;
        handlers: Array<GmEventHadler | MapEventHadler>;
    };
};
type GmEventHandlersWithControl = {
    [key in GmEventName]?: {
        controlHandler: (event: AnyEvent) => void;
        handlers: Array<GmEventHadler | MapEventHadler>;
    };
};
type EventControls = GmEventHandlersWithControl[GmEventName] | MapEventHandlersWithControl[MapEventName];

declare const isGmFeatureBeforeCreateEvent: (payload: unknown) => payload is GMBeforeFeatureCreateEvent;
declare const isGmFeatureBeforeUpdateEvent: (payload: unknown) => payload is GMBeforeFeatureUpdateEvent;

type EventType = ActionType | 'control';
type EventLevel = 'system' | 'user';
type NonEmptyArray<T> = [T, ...T[]];
type GMBaseEvent = {
    level: EventLevel;
    type: EventType;
    action: string;
};
type GMEvent = GMDrawEvent | GMEditEvent | GMHelperEvent | GMControlEvent | GMFeatureEvent;
type GmPrefix = typeof gmPrefix;
type GmEventNameWithoutPrefix = EventType;
type GmEventName = `${GmPrefix}:${GmEventNameWithoutPrefix}`;

declare class GMEvents {
    gm: Geoman;
    bus: EventBus;
    listeners: {
        [key in EventType]?: BaseEventListener$1;
    };
    constructor(gm: Geoman);
    fire(eventName: GmEventName, payload: GMEvent): void;
}

declare abstract class BasePopup<TPopupInstance = unknown> {
    abstract popupInstance: TPopupInstance | null;
    abstract setLngLat(lngLat: LngLat): void;
    abstract setHtml(htmlContent: string): void;
    abstract remove(): void;
    isInstanceAvailable(): this is {
        popupInstance: TPopupInstance;
    };
}

declare abstract class BaseMapAdapter<TMapInstance = MapInstanceWithGeoman, TSource = unknown, TLayer = unknown> {
    abstract mapType: keyof MapTypes;
    abstract mapInstance: TMapInstance;
    abstract getMapInstance(): TMapInstance;
    abstract isLoaded(): boolean;
    abstract getContainer(): HTMLElement;
    abstract getCanvas(): HTMLCanvasElement;
    abstract addControl(control: GMControl): void;
    abstract removeControl(control: GMControl): void;
    abstract loadImage({ id, image }: {
        id: string;
        image: string;
    }): Promise<void>;
    abstract getBounds(): [LngLat, LngLat];
    abstract fitBounds(bounds: [LngLat, LngLat], options?: BaseFitBoundsOptions): void;
    abstract setCursor(cursor: CursorType): void;
    abstract disableMapInteractions(interactionTypes: Array<MapInteraction>): void;
    abstract enableMapInteractions(interactionTypes: Array<MapInteraction>): void;
    abstract setDragPan(value: boolean): void;
    abstract queryFeaturesByScreenCoordinates({ queryCoordinates, sourceNames }: {
        queryCoordinates: ScreenPoint | [ScreenPoint, ScreenPoint];
        sourceNames: Array<FeatureSourceName>;
    }): Array<FeatureData>;
    abstract queryGeoJsonFeatures({ queryCoordinates, sourceNames }: {
        queryCoordinates?: ScreenPoint | [ScreenPoint, ScreenPoint];
        sourceNames: Array<FeatureSourceName>;
    }): Array<GeoJsonFeatureData>;
    abstract addSource(sourceId: string, geoJson: GeoJSON): BaseSource<TSource>;
    abstract getSource(sourceId: string): BaseSource<TSource>;
    abstract addLayer(options: unknown): BaseLayer<TLayer>;
    abstract getLayer(layerId: string): BaseLayer<TLayer>;
    abstract removeLayer(layerId: string): void;
    abstract eachLayer(callback: (layer: BaseLayer<TLayer>) => void): void;
    abstract createDomMarker(options: BaseDomMarkerOptions, lngLat: LngLat): BaseDomMarker;
    abstract createPopup(options: BasePopupOptions): BasePopup;
    abstract project(position: LngLat): ScreenPoint;
    abstract unproject(point: ScreenPoint): LngLat;
    abstract coordBoundsToScreenBounds(bounds: [LngLat, LngLat]): [ScreenPoint, ScreenPoint];
    getEuclideanNearestLngLat(shapeGeoJson: Feature<LineBasedGeometry> | FeatureCollection<LineBasedGeometry>, lngLat: LngLat): LngLat;
    abstract fire(type: AnyEventName, data?: unknown): void;
    abstract on(type: AnyEventName, listener: BaseEventListener): void;
    abstract on(type: AnyEventName, layerId: string, listener: BaseEventListener): void;
    abstract once(type: AnyEventName, listener: BaseEventListener): void;
    abstract once(type: AnyEventName, layerId: string, listener: BaseEventListener): void;
    abstract off(type: AnyEventName, listener: BaseEventListener): void;
    abstract off(type: AnyEventName, layerId: string, listener: BaseEventListener): void;
    getDistance(lngLat1: LngLat, lngLat2: LngLat): number;
}

declare class GmOptions {
    gm: Geoman;
    settings: GmOptionsData['settings'];
    controls: GmOptionsData['controls'];
    layerStyles: GmOptionsData['layerStyles'];
    constructor(gm: Geoman, inputOptions: PartialDeep<GmOptionsData>);
    getMergedOptions(options?: PartialDeep<GmOptionsData>): GmOptionsData;
    enableMode(actionType: ActionType, modeName: ModeName): void;
    disableMode(actionType: ActionType, modeName: ModeName): void;
    syncModeState(actionType: ActionType, modeName: ModeName): void;
    toggleMode(actionType: ActionType, modeName: ModeName): void;
    isModeEnabled(actionType: ActionType, modeName: ModeName): boolean;
    isModeAvailable(actionType: ActionType, modeName: ModeName): boolean;
    getControlOptions({ actionType, modeName }: {
        actionType: ActionType;
        modeName: ModeName;
    }): ControlOptions | null;
    fireModeEvent(sectionName: ActionType, modeName: ModeName, action: ModeAction): void;
    fireControlEvent(sectionName: ActionType, modeName: ModeName, action: GMControlSwitchEvent['action']): void;
}

type DrawClassConstructor = new (gm: Geoman) => BaseDraw;
type DrawClassMap = {
    [K in DrawModeName]: DrawClassConstructor | null;
};
declare const drawClassMap: DrawClassMap;

type EditClassConstructor = new (gm: Geoman) => BaseEdit;
type EditClassMap = {
    [K in EditModeName]: EditClassConstructor | null;
};
declare const editClassMap: EditClassMap;

type HelperClassConstructor = new (gm: Geoman) => BaseHelper;
type HelperClassMap = {
    [K in HelperModeName]: HelperClassConstructor | null;
};
declare const helperClassMap: HelperClassMap;

type EnableMarkerParameters = {
    lngLat?: LngLat;
    customMarker?: BaseDomMarker;
    invisibleMarker?: boolean;
};
declare class MarkerPointer {
    gm: Geoman;
    marker: BaseDomMarker | null;
    tmpMarker: BaseDomMarker | null;
    private snapping;
    private oldSnapping;
    throttledMethods: {
        onMouseMove: MapEventHadler;
    };
    mapEventHandlers: MapEventHandlers;
    constructor(gm: Geoman);
    initEventHandlers(): void;
    get snappingHelper(): SnappingHelper | null;
    setSnapping(snapping: boolean): void;
    pauseSnapping(): void;
    resumeSnapping(): void;
    enable({ lngLat, customMarker, invisibleMarker }?: EnableMarkerParameters): void;
    disable(): void;
    createMarker(lngLat?: LngLat): BaseDomMarker;
    createInvisibleMarker(lngLat?: LngLat): BaseDomMarker;
    onMouseMove(event: AnyEvent): {
        next: boolean;
    };
    syncTmpMarker(lngLat: LngLat): void;
}

declare const isGmDrawEvent: (payload: unknown) => payload is GMDrawEvent;
declare const isGmDrawShapeEvent: (payload: unknown) => payload is GMDrawShapeEvent | GMDrawShapeEventWithData;
declare const isGmDrawLineDrawerEvent: (payload: unknown) => payload is GMDrawLineDrawerEvent | GMDrawLineDrawerEventWithData;
declare const isGmDrawFreehandDrawerEvent: (payload: unknown) => payload is GMDrawFreehandDrawerEvent | GMDrawFreehandDrawerEventWithData;

declare const isGmHelperEvent: (payload: unknown) => payload is GMHelperModeEvent;

declare const isGmEditEvent: (payload: unknown) => payload is GMEditEvent;

declare const isActionType: (name: string) => name is ActionType;
declare const isDrawModeName: (name: string) => name is DrawModeName;
declare const isEditModeName: (name: string) => name is EditModeName;
declare const isHelperModeName: (name: string) => name is HelperModeName;
declare const isModeName: (name: string) => name is ModeName;

type ModeOptionName = DrawModeName | EditModeName | HelperModeName;
type ControlIcons = Record<ModeOptionName, string | null>;
declare const controlIcons: ControlIcons;

declare const customShapeTriangle: {
    type: string;
    properties: {
        shape: string;
    };
    geometry: {
        type: string;
        coordinates: number[][][][];
    };
};
declare const customShapeRectangle: {
    type: string;
    properties: {
        shape: string;
    };
    geometry: {
        type: string;
        coordinates: number[][][];
    };
};

declare const mergeByTypeCustomizer: (objValue: unknown, srcValue: unknown) => any[] | undefined;

declare const convertToThrottled: <T extends object>(methods: T, context: unknown, wait?: number) => T;

declare const moveGeoJson: (geoJson: GeoJsonShapeFeature, lngLatDiff: LngLatDiff) => GeoJsonShapeFeature;
declare const moveFeatureData: (featureData: FeatureData, lngLatDiff: LngLatDiff) => void;
declare const isGeoJsonFeatureInPolygon: (featureGeoJson: Feature, containerGeoJson: Feature<Polygon | MultiPolygon>) => boolean;

declare const isEqualPosition: (position1: LngLat, position2: LngLat) => boolean;
declare const isPolygonFeature: (geoJson: Feature | FeatureCollection) => geoJson is Feature<Polygon>;
declare const isMultiPolygonFeature: (geoJson: Feature | FeatureCollection) => geoJson is Feature<MultiPolygon>;
declare const getLngLatDiff: (startLngLat: LngLat, endLngLat: LngLat) => LngLatDiff;
declare const eachCoordinateWithPath: (geoJson: GeoJSON, callback: (position: PositionData, index: number) => void, skipClosingCoordinate?: boolean) => void;
declare const findCoordinateWithPath: (geoJson: GeoJSON, coordinate: LngLat) => {
    index: number;
    coordinate: LngLat;
    path: (string | number)[];
} | null;
declare const eachSegmentWithPath: (geoJson: GeoJSON, callback: (segment: SegmentPosition, index: number) => void) => void;
declare const twoCoordsToLineString: (position1: LngLat, position2: LngLat, properties?: GeoJsonProperties) => Feature<LineString>;
declare const geoJsonPointToLngLat: (geoJson: Feature<Point>) => LngLat;
declare const boundsToBBox: (bounds: [LngLat, LngLat]) => BBox;
declare const boundsContains: (bounds: [LngLat, LngLat], lngLat: LngLat) => boolean;
declare const getGeoJsonCoordinatesCount: (geoJson: GeoJSON) => number;
declare const getGeoJsonFirstPoint: (shapeGeoJson: GeoJSON) => LngLat | null;
declare const getEuclideanDistance: (point1: ScreenPoint, point2: ScreenPoint) => number;
declare const getEuclideanSegmentNearestPoint: (linePoint1: ScreenPoint, linePoint2: ScreenPoint, targetPoint: ScreenPoint) => ScreenPoint;
declare const calculatePerimeter: (geoJson: Feature<LineBasedGeometry>) => number;
declare const convertToLineStringFeatureCollection: (sourceFeatureCollection: GeoJsonShapeFeatureCollection) => FeatureCollection<LineString>;
declare const lngLatToGeoJsonPoint: (position: LngLat, shape?: Extract<ShapeName, "marker" | "text_marker" | "circle_marker">) => GeoJsonShapeFeature;

declare const toMod: (num: number, mod: number) => number;
declare const formatDistance: (num: number) => string;
declare const formatArea: (num: number) => string;

declare const typedKeys: <T extends object>(obj: T) => Array<keyof T>;
declare const includesWithType: <T extends readonly string[]>(value: string, validValues: T) => value is T[number];

declare const isGmControlEvent: (payload: unknown) => payload is GMControlSwitchEvent;

declare const isGmEvent: (payload: unknown) => payload is GMEvent;
declare const isGmModeEvent: (payload: unknown) => payload is GmBaseModeEvent;

declare function isPointerEventName(key: string): key is PointerEventName;
declare function isBaseMapEventName(key: string): key is BaseMapEventName;
declare const hasMapOnceMethod: (map: unknown) => map is MapWithOnceMethod;
declare const isMapPointerEvent: (event: AnyEvent, options?: {
    warning: boolean;
}) => event is MapPointerEvent;

declare const isNonEmptyArray: <T>(arr: T[] | readonly T[]) => arr is NonEmptyArray<T>;

type UpdateShapeHandler = (featureData: FeatureData, lngLatStart: LngLat, lngLatEnd: LngLat) => GeoJsonShapeFeature | null;
declare abstract class BaseDrag extends BaseEdit {
    mode: EditModeName;
    isDragging: boolean;
    previousLngLat: LngLat | null;
    pointBasedShapes: Array<FeatureShape>;
    throttledMethods: {
        onMouseMove: (event: AnyEvent) => MapHandlerReturnData;
    };
    mapEventHandlers: {
        "gm:edit": (event: AnyEvent) => MapHandlerReturnData;
        mousedown: (event: AnyEvent) => MapHandlerReturnData;
        touchstart: (event: AnyEvent) => MapHandlerReturnData;
        mousemove: (event: AnyEvent) => MapHandlerReturnData;
        touchmove: (event: AnyEvent) => MapHandlerReturnData;
        mouseup: () => MapHandlerReturnData;
        touchend: () => MapHandlerReturnData;
    };
    getUpdatedGeoJsonHandlers: {
        [key in FeatureShape]?: UpdateShapeHandler;
    };
    onMouseDown(event: AnyEvent): MapHandlerReturnData;
    onMouseUp(): MapHandlerReturnData;
    onMouseMove(event: AnyEvent): MapHandlerReturnData;
    isPointBasedShape(): boolean;
    abstract handleGmEdit(event: AnyEvent): MapHandlerReturnData;
    alignShapeCenterWithControlMarker(featureData: FeatureData, event: AnyEvent): void;
    moveFeature(featureData: FeatureData, newLngLat: LngLat): void;
    moveSource(featureData: FeatureData, oldLngLat: LngLat, newLngLat: LngLat): GeoJsonShapeFeature;
    moveCircle(featureData: FeatureData, oldLngLat: LngLat, newLngLat: LngLat): GeoJsonShapeFeature | null;
}

declare abstract class BaseGroupEdit extends BaseEdit {
    abstract mode: EditModeName;
    abstract allowedShapeTypes: Array<FeatureShape>;
    features: Array<FeatureData>;
    featureData: FeatureData | null;
    mapEventHandlers: {
        click: (event: AnyEvent) => MapHandlerReturnData;
    };
    onStartAction(): void;
    onEndAction(): void;
    onMouseClick(event: AnyEvent): MapHandlerReturnData;
    unselectFeature(event: AnyEvent): boolean;
    getAllowedFeatureByMouseEvent({ event, sourceNames }: {
        event: AnyEvent;
        sourceNames: Array<FeatureSourceName>;
    }): FeatureData | null;
    isFeatureAllowedToGroup(featureData: FeatureData): boolean;
    groupFeatures(): void;
}

type SharedMarker = {
    markerData: MarkerData;
    featureData: FeatureData;
};
interface SnapGuidesHelperInterface extends BaseHelper {
    removeSnapGuides(): void;
    updateSnapGuides(shapeGeoJson: GeoJsonShapeFeature | null, currentLngLat: LngLat | null, withControlMarker?: boolean): void;
}
interface AutoTraceHelperInterface extends BaseHelper {
    mode: 'auto_trace';
    getShortestPath(lngLatStart: LngLat, lngLatEnd: LngLat): Array<LngLat> | null;
}
interface PinHelperInterface extends BaseHelper {
    mode: 'pin';
    getSharedMarkers(coordinate: LngLat): Array<SharedMarker>;
}

type SegmentData = {
    segment: SegmentPosition;
    middle: PositionData;
    edgeMarkerKey: string;
};
type CreateMarkerParams = {
    type: MarkerData['type'];
    positionData: PositionData;
    parentFeature: FeatureData;
    segment?: EdgeMarkerData['segment'];
};
declare class ShapeMarkersHelper extends BaseHelper {
    mode: HelperModeName;
    pinEnabled: boolean;
    previousPosition: LngLat | null;
    activeMarker: MarkerData | null;
    activeFeatureData: FeatureData | null;
    sharedMarkers: Array<SharedMarker>;
    allowedShapes: Array<FeatureShape>;
    edgeMarkersAllowed: boolean;
    edgeMarkerAllowedShapes: Array<FeatureShape>;
    shapeMarkerAllowedModes: Array<EditModeName>;
    mapEventHandlers: {
        "gm:draw": (event: AnyEvent) => MapHandlerReturnData;
        "gm:edit": (event: AnyEvent) => MapHandlerReturnData;
        mousedown: (event: AnyEvent) => MapHandlerReturnData;
        touchstart: (event: AnyEvent) => MapHandlerReturnData;
        mouseup: () => MapHandlerReturnData;
        touchend: () => MapHandlerReturnData;
        mousemove: (event: AnyEvent) => MapHandlerReturnData;
        touchmove: (event: AnyEvent) => MapHandlerReturnData;
        contextmenu: (event: AnyEvent) => MapHandlerReturnData;
    };
    throttledMethods: {
        sendMarkerMoveEvent: (event: MapPointerEvent) => void;
        sendMarkerRightClickEvent: (featureData: FeatureData, markerData: MarkerData) => void;
    };
    debouncedMethods: {
        refreshMarkers: () => void;
    };
    onStartAction(): void;
    onEndAction(): void;
    setPin(enabled: boolean): void;
    onMouseDown(event: AnyEvent): MapHandlerReturnData;
    onMouseUp(): MapHandlerReturnData;
    onMouseMove(event: AnyEvent): MapHandlerReturnData;
    onMouseRightButtonClick(event: AnyEvent): MapHandlerReturnData;
    get pinHelperInstance(): PinHelperInterface | null;
    isShapeMarkerAllowed(): boolean;
    convertToVertexMarker(markerData: MarkerData): MarkerData;
    getFeatureMarkerByMouseEvent(event: AnyEvent): Exclude<MarkerData, DomMarkerData> | null;
    addMarkers(): void;
    addCenterMarker(featureData: FeatureData): void;
    getAllShapeSegments(featureData: FeatureData): SegmentData[];
    isEdgeMarkerAllowed(featureData: FeatureData): boolean;
    isMarkerIndexAllowed(shape: FeatureData['shape'], markerIndex: number, verticesCount: number): boolean;
    getEdgeMarkerKey(index: number): string;
    getSegmentMiddlePosition(segment: SegmentPosition): PositionData;
    removeMarkers(): void;
    removeMarker(markerData: MarkerData): void;
    protected createMarker({ type, segment, positionData, parentFeature }: CreateMarkerParams): MarkerData;
    handleGmDraw(event: AnyEvent): MapHandlerReturnData;
    refreshMarkers(): void;
    handleGmEdit(event: AnyEvent): MapHandlerReturnData;
    handleShapeUpdate(event: GMEditFeatureUpdatedEvent): void;
    createOrUpdateVertexMarker(position: PositionData, featureData: FeatureData): {
        markerKey: string;
        markerData: MarkerData;
    };
    createOrUpdateEdgeMarker(segmentData: SegmentData, featureData: FeatureData): {
        markerKey: string;
        markerData: MarkerData;
    };
    updateCenterMarkerPosition(featureData: FeatureData): void;
    sendMarkerEvent(action: GMEditMarkerEvent['action'], featureData: FeatureData, markerData: MarkerData): void;
    sendMarkerRightClickEvent(featureData: FeatureData, markerData: MarkerData): void;
    sendMarkerMoveEvent(event: MapPointerEvent): void;
}

type LineDrawerOptions = {
    snappingMarkers: 'first' | 'last' | 'all' | 'none';
    targetShape: Extract<ShapeName, 'line' | 'polygon'>;
};
type MarkerInfo = {
    index: number;
    path: MarkerId | null;
};
type MarkerHandler = ({ markerIndex, shapeCoordinates, geoJson }: LineEventHandlerArguments) => void;
interface DrawerHandlers {
    firstMarkerClick: MarkerHandler | null;
    lastMarkerClick: MarkerHandler | null;
    nMarkerClick: MarkerHandler | null;
}
declare class LineDrawer extends BaseDraw {
    mode: DrawModeName;
    snappingKey: string;
    drawOptions: LineDrawerOptions;
    shapeLngLats: Array<LngLat>;
    throttledMethods: {
        onMouseMove: (event: AnyEvent) => MapHandlerReturnData;
    };
    mapEventHandlers: {
        "gm:helper": (event: AnyEvent) => MapHandlerReturnData;
        click: (event: AnyEvent) => MapHandlerReturnData;
        mousemove: (event: AnyEvent) => MapHandlerReturnData;
    };
    drawerEventHandlers: DrawerHandlers;
    constructor(gm: Geoman, options?: LineDrawerOptions);
    get snapGuidesInstance(): SnapGuidesHelperInterface | null;
    get autoTraceEnabled(): boolean;
    get autoTraceHelperInstance(): AutoTraceHelperInterface | null;
    onStartAction(): void;
    onEndAction(): void;
    handleGmHelperEvent(event: AnyEvent): MapHandlerReturnData;
    updateSnapGuides(): void;
    on<T extends keyof DrawerHandlers>(eventType: T, handler: DrawerHandlers[T]): void;
    onMouseClick(event: AnyEvent): MapHandlerReturnData;
    handleNextVertex(lngLat: LngLat, clickedMarkerInfo: MarkerInfo): void;
    getMarkerClickEventData(markerIndex: number): LineEventHandlerArguments;
    onMouseMove(event: AnyEvent): MapHandlerReturnData;
    startShape(startLngLat: LngLat): void;
    endShape(): void;
    setSnapping(): void;
    removeSnapping(): void;
    getClickedMarkerInfo(event: MapPointerEvent): MarkerInfo;
    addPoint(newLngLat: LngLat, existingMarkerInfo: MarkerInfo): void;
    isFeatureAllowed(featureGeoJson: GeoJsonShapeFeature): boolean;
    getAddedLngLats(newLngLat: LngLat, existingMarkerInfo: MarkerInfo): LngLat[];
    getAutoTracePath(finishLngLat: LngLat): Array<LngLat> | null;
    getMarkerInfoLngLat(markerInfo: MarkerInfo): LngLat | null;
    addMarker(lngLat: LngLat, featureData: FeatureData): MarkerData;
    createMarker(lngLat: LngLat): BaseDomMarker<unknown>;
    updateFeatureSource(): void;
    getFeatureGeoJson({ withControlMarker, coordinates }: {
        withControlMarker: boolean;
        coordinates?: Array<Position>;
    }): GeoJsonLineFeature;
    getFeatureGeoJsonWithType({ withControlMarker, coordinates }: {
        withControlMarker: boolean;
        coordinates?: Array<Position>;
    }): GeoJsonShapeFeature;
    getShapeCoordinates({ withControlMarker }: {
        withControlMarker: boolean;
    }): Array<LngLat>;
    fireStartEvent(featureData: FeatureData, markerData: MarkerData): void;
    fireUpdateEvent(featureData: FeatureData, markerData: MarkerData): void;
    fireStopEvent(featureGeoJson: GeoJsonLineFeature): void;
}

declare class Geoman {
    mapAdapterInstance: BaseMapAdapter<AnyMapInstance> | null;
    globalLngLatBounds: [LngLat, LngLat];
    features: Features;
    loaded: boolean;
    options: GmOptions;
    events: GMEvents;
    control: GMControl;
    actionInstances: {
        [key in ActionInstanceKey]?: ActionInstance;
    };
    markerPointer: MarkerPointer;
    constructor(map: AnyMapInstance, options?: PartialDeep<GmOptionsData>);
    initCoreOptions(options?: PartialDeep<GmOptionsData>): GmOptions;
    initCoreEvents(): GMEvents;
    initCoreFeatures(): Features;
    initCoreControls(): GMControl;
    initMarkerPointer(): MarkerPointer;
    get drawClassMap(): {
        marker: (new (gm: Geoman) => BaseDraw) | null;
        circle: (new (gm: Geoman) => BaseDraw) | null;
        circle_marker: (new (gm: Geoman) => BaseDraw) | null;
        text_marker: (new (gm: Geoman) => BaseDraw) | null;
        line: (new (gm: Geoman) => BaseDraw) | null;
        rectangle: (new (gm: Geoman) => BaseDraw) | null;
        polygon: (new (gm: Geoman) => BaseDraw) | null;
        freehand: (new (gm: Geoman) => BaseDraw) | null;
        custom_shape: (new (gm: Geoman) => BaseDraw) | null;
    };
    get editClassMap(): {
        drag: (new (gm: Geoman) => BaseEdit) | null;
        change: (new (gm: Geoman) => BaseEdit) | null;
        rotate: (new (gm: Geoman) => BaseEdit) | null;
        scale: (new (gm: Geoman) => BaseEdit) | null;
        copy: (new (gm: Geoman) => BaseEdit) | null;
        cut: (new (gm: Geoman) => BaseEdit) | null;
        split: (new (gm: Geoman) => BaseEdit) | null;
        union: (new (gm: Geoman) => BaseEdit) | null;
        difference: (new (gm: Geoman) => BaseEdit) | null;
        line_simplification: (new (gm: Geoman) => BaseEdit) | null;
        lasso: (new (gm: Geoman) => BaseEdit) | null;
        delete: (new (gm: Geoman) => BaseEdit) | null;
    };
    get helperClassMap(): {
        shape_markers: (new (gm: Geoman) => BaseHelper) | null;
        pin: (new (gm: Geoman) => BaseHelper) | null;
        snapping: (new (gm: Geoman) => BaseHelper) | null;
        snap_guides: (new (gm: Geoman) => BaseHelper) | null;
        measurements: (new (gm: Geoman) => BaseHelper) | null;
        auto_trace: (new (gm: Geoman) => BaseHelper) | null;
        geofencing: (new (gm: Geoman) => BaseHelper) | null;
        zoom_to_features: (new (gm: Geoman) => BaseHelper) | null;
        click_to_edit: (new (gm: Geoman) => BaseHelper) | null;
    };
    get mapAdapter(): BaseMapAdapter<AnyMapInstance>;
    addControls(controlsElement?: HTMLElement | undefined): Promise<void>;
    isMapInstanceLoaded(map: AnyMapInstance): unknown;
    init(map: MapInstanceWithGeoman): Promise<void>;
    destroy(): void;
    removeControls(): void;
    onMapLoad(): Promise<void>;
    disableAllModes(): void;
    getActiveDrawModes(): Array<DrawModeName>;
    getActiveEditModes(): Array<EditModeName>;
    getActiveHelperModes(): Array<HelperModeName>;
    getGlobalLngLatBounds(): [LngLat, LngLat];
    createDrawInstance(shape: DrawModeName): BaseDraw | null;
    createEditInstance(mode: EditModeName): BaseEdit | null;
    createHelperInstance(mode: HelperModeName): BaseHelper | null;
    setGlobalEventsListener(callback?: EventForwarder['globalEventsListener']): void;
    enableMode(actionType: ActionType, modeName: ModeName): void;
    disableMode(actionType: ActionType, modeName: ModeName): void;
    toggleMode(actionType: ActionType, modeName: ModeName): void;
    isModeEnabled(actionType: ActionType, modeName: ModeName): boolean;
    enableDraw(shape: DrawModeName): void;
    disableDraw(): void;
    toggleDraw(shape: DrawModeName): void;
    drawEnabled(shape: DrawModeName): boolean;
    enableGlobalDragMode(): void;
    disableGlobalDragMode(): void;
    toggleGlobalDragMode(): void;
    globalDragModeEnabled(): boolean;
    enableGlobalEditMode(): void;
    disableGlobalEditMode(): void;
    toggleGlobalEditMode(): void;
    globalEditModeEnabled(): boolean;
    enableGlobalRotateMode(): void;
    disableGlobalRotateMode(): void;
    toggleGlobalRotateMode(): void;
    globalRotateModeEnabled(): boolean;
    enableGlobalCutMode(): void;
    disableGlobalCutMode(): void;
    toggleGlobalCutMode(): void;
    globalCutModeEnabled(): boolean;
    enableGlobalRemovalMode(): void;
    disableGlobalRemovalMode(): void;
    toggleGlobalRemovalMode(): void;
    globalRemovalModeEnabled(): boolean;
}
declare const createGeomanInstance: (map: AnyMapInstance, options: PartialDeep<GmOptionsData>) => Promise<Geoman>;

export { type ActionInstance, type ActionInstanceKey, type ActionOption, type ActionOptions, type ActionType, type AnchorPosition, type AnyEvent, type AnyEventName, type AnyMapInstance, BaseAction, type BaseControlsPosition, BaseDomMarker, type BaseDomMarkerOptions, BaseDrag, BaseDraw, BaseEdit, type BaseEventListener, type BaseFitBoundsOptions, BaseGroupEdit, BaseHelper, BaseLayer, BaseMapAdapter, type BaseMapEventName, BasePopup, type BasePopupOptions, BaseSource, type BasicGeometry, type CenterMarkerData, type ChoiceItem, type ControlOptions, type ControlSettings, type CoordinateIndices, type CursorType, type DomMarkerData, type DrawModeName, type EdgeMarkerData, type EditModeName, type EventControls, type EventLevel, type EventType, type ExtraDrawModeName, FEATURE_ID_PROPERTY, type FeatureCreatedFwdEvent, FeatureData, type FeatureDataParameters, type FeatureEditEndFwdEvent, type FeatureEditFwdEvent, type FeatureEditStartFwdEvent, type FeatureFwdEvent, type FeatureId, type FeatureOrder, type FeatureOrders, type FeatureRemovedFwdEvent, type FeatureShape, type FeatureShapeProperties, type FeatureSourceName, type FeatureStore, type FeatureUpdatedFwdEvent, type ForEachFeatureDataCallbackFn, type FwdEditModeName, type GMBaseEvent, type GMBeforeFeatureCreateEvent, type GMBeforeFeatureUpdateEvent, GMControl, type GMControlEvent, type GMControlLoadEvent, type GMControlSwitchEvent, type GMDrawEvent, type GMDrawFreehandDrawerEvent, type GMDrawFreehandDrawerEventWithData, type GMDrawLineDrawerEvent, type GMDrawLineDrawerEventWithData, type GMDrawModeEvent, type GMDrawShapeCreatedEvent, type GMDrawShapeEvent, type GMDrawShapeEventWithData, type GMEditEvent, type GMEditFeatureEditEndEvent, type GMEditFeatureEditStartEvent, type GMEditFeatureRemovedEvent, type GMEditFeatureUpdatedEvent, type GMEditMarkerEvent, type GMEditMarkerMoveEvent, type GMEditModeEvent, type GMEvent, type GMFeatureEvent, type GMGeofencingViolationEvent, type GMHelperEvent, type GMHelperModeEvent, type GenericControlsOptions, type GenericSystemControl, type GenericSystemControls, type GeoJsonDiffStorage, type GeoJsonFeatureData, type GeoJsonImportFeature, type GeoJsonImportFeatureCollection, type GeoJsonLineFeature, type GeoJsonShapeFeature, type GeoJsonShapeFeatureCollection, type GeoJsonShapeFeatureWithGmProperties, type GeoJsonSourceDiff, Geoman, type GlobalEventsListener, type GlobalEventsListenerParameters, type GlobalModeToggledFwdEvent, type GmBaseModeEvent, type GmEventHadler, type GmEventHandlersWithControl, type GmEventName, type GmEventNameWithoutPrefix, type GmFwdEvent, type GmFwdEventName, type GmFwdEventNameWithPrefix, type GmFwdSystemEventNameWithPrefix, type GmLoadedFwdEvent, GmOptions, type GmOptionsData, type GmOptionsPartial, type GmPrefix, type GmServiceEventName, type GmServiceEventNameWithPrefix, type GmSystemPrefix, type HelperModeName, type ImportGeoJsonProperties, type LayerStyle, type LineBasedGeometry, LineDrawer, type LineEventHandlerArguments, type LngLat, type LngLatDiff, type MapEvent, type MapEventHadler, type MapEventHandlers, type MapEventHandlersWithControl, type MapEventName, type MapHandlerReturnData, type MapInstanceWithGeoman, type MapInteraction, type MapPointerEvent, type MapTypes, type MapWithOnceMethod, type MarkerData, type MarkerId, MarkerPointer, type ModeAction, type ModeName, type NonEmptyArray, type PartialCircleLayer, type PartialFillLayer, type PartialLayerStyle, type PartialLineLayer, type PartialSymbolLayer, type PointBasedGeometry, type PointerEventName, type PositionData, SOURCES, type ScreenPoint, type SegmentPosition, type SelectActionOption, type ShapeGeoJsonProperties, ShapeMarkersHelper, type ShapeName, type SourceStyles, type SourceUpdateMethods, type SourcesStorage, type StyleVariables, type SubAction, type SubActions, type SystemControl, type SystemControls, type SystemFwdEvent, type ToggleActionOption, type UpdateStorage, type VertexMarkerData, baseMapEventNames, boundsContains, boundsToBBox, calculatePerimeter, controlActions, controlIcons, convertToLineStringFeatureCollection, convertToThrottled, createGeomanInstance, customShapeRectangle, customShapeTriangle, styles as defaultLayerStyles, drawClassMap, drawModes, eachCoordinateWithPath, eachSegmentWithPath, editClassMap, editModes, extraDrawModes, findCoordinateWithPath, formatArea, formatDistance, geoJsonPointToLngLat, geofencingViolationActions, getEuclideanDistance, getEuclideanSegmentNearestPoint, getGeoJsonCoordinatesCount, getGeoJsonFirstPoint, getLngLatDiff, gmPrefix, gmServiceEventNames, hasMapOnceMethod, helperClassMap, helperModes, includesWithType, isActionType, isBaseMapEventName, isDrawModeName, isEditModeName, isEqualPosition, isGeoJsonFeatureInPolygon, isGmControlEvent, isGmDrawEvent, isGmDrawFreehandDrawerEvent, isGmDrawLineDrawerEvent, isGmDrawShapeEvent, isGmEditEvent, isGmEvent, isGmFeatureBeforeCreateEvent, isGmFeatureBeforeUpdateEvent, isGmHelperEvent, isGmModeEvent, isHelperModeName, isMapPointerEvent, isModeName, isMultiPolygonFeature, isNonEmptyArray, isPointerEventName, isPolygonFeature, lngLatToGeoJsonPoint, mapInteractions, mergeByTypeCustomizer, modeActions, moveFeatureData, moveGeoJson, pointerEvents, shapeNames, toMod, twoCoordsToLineString, typedKeys };
