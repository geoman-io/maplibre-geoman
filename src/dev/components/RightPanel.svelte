<script lang="ts">
  import type { Geoman, GeoJsonImportFeature } from '@/main.ts';
  import type { Map as MaplibreMap } from 'maplibre-gl';
  import commonShapes from '@tests/fixtures/common-shapes.json';
  import oneOfEachShape from '@tests/fixtures/one-shape-of-each-type.json';
  import {
    loadStressTestFeatureCollection,
    loadStressTestCircleMarkers,
  } from '@/dev/fixtures/shapes.ts';

  interface Props {
    geoman: Geoman | null;
    map: MaplibreMap | null;
  }

  interface EventLogEntry {
    id: number;
    time: string;
    name: string;
    data?: string;
  }

  interface SourceInfo {
    name: string;
    featureCount: number;
    isInternal: boolean;
  }

  interface LayerInfo {
    id: string;
    type: string;
    source: string;
    isInternal: boolean;
  }

  let { geoman, map }: Props = $props();

  // Section collapse states
  let layersExpanded = $state(true);
  let shapesExpanded = $state(true);
  let geojsonExpanded = $state(true);
  let eventsExpanded = $state(false);
  let debugExpanded = $state(true);

  // Layer group collapse states
  let gmSourcesExpanded = $state(true);
  let otherSourcesExpanded = $state(false);
  let gmLayersExpanded = $state(false);
  let otherLayersExpanded = $state(false);

  // GeoJSON textarea content
  let geojsonInput = $state('');
  let prettyPrint = $state(true);

  // Event log state
  let eventLog = $state<EventLogEntry[]>([]);
  let eventLoggingEnabled = $state(true);
  let eventIdCounter = $state(0);
  let eventFilters = $state({
    create: true,
    update: true,
    remove: true,
    draw: true,
    edit: true,
    mode: true,
  });

  // Debug info
  let cursorLng = $state(0);
  let cursorLat = $state(0);
  let featureCount = $state(0);
  let currentMode = $state('none');

  // Layer/Source info
  let sources = $state<SourceInfo[]>([]);
  let layers = $state<LayerInfo[]>([]);
  let lastLayerUpdate = $state('');

  // Track registered listeners
  let listenersRegistered = $state(false);

  const toggleSection = (section: string) => {
    switch (section) {
      case 'layers':
        layersExpanded = !layersExpanded;
        break;
      case 'shapes':
        shapesExpanded = !shapesExpanded;
        break;
      case 'geojson':
        geojsonExpanded = !geojsonExpanded;
        break;
      case 'events':
        eventsExpanded = !eventsExpanded;
        break;
      case 'debug':
        debugExpanded = !debugExpanded;
        break;
    }
  };

  // Event logging
  const logEvent = (name: string, data?: unknown) => {
    if (!eventLoggingEnabled) return;

    // Check filters
    if (name.includes('create') && !eventFilters.create) return;
    if (name.includes('update') && !eventFilters.update) return;
    if (name.includes('remove') && !eventFilters.remove) return;
    if (name.includes('draw') && !eventFilters.draw) return;
    if ((name.includes('drag') || name.includes('change') || name.includes('rotate')) && !eventFilters.edit) return;
    if (name.includes('mode') && !eventFilters.mode) return;

    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    eventLog = [
      {
        id: eventIdCounter++,
        time,
        name,
        data: data ? JSON.stringify(data, null, 2).slice(0, 500) : undefined,
      },
      ...eventLog.slice(0, 99), // Keep last 100 events
    ];
  };

  const clearEventLog = () => {
    eventLog = [];
  };

  const toggleEventFilter = (filter: keyof typeof eventFilters) => {
    eventFilters[filter] = !eventFilters[filter];
  };

  // Register event listeners when geoman changes
  $effect(() => {
    if (!geoman || !map || listenersRegistered) return;

    const events = [
      'gm:create',
      'gm:update',
      'gm:remove',
      'gm:drawstart',
      'gm:drawend',
      'gm:dragstart',
      'gm:drag',
      'gm:dragend',
      'gm:globaldrawmodetoggled',
      'gm:globaldragmodetoggled',
      'gm:globalchangemodetoggled',
      'gm:globalrotatemodetoggled',
      'gm:globalcutmodetoggled',
      'gm:globaldeletemodetoggled',
    ];

    events.forEach((eventName) => {
      map.on(eventName, (e: { type: string; feature?: { id?: string }; action?: string }) => {
        const eventData = {
          type: e.type,
          featureId: e.feature?.id,
          action: e.action,
        };
        logEvent(eventName, eventData);
        updateDebugInfo();
      });
    });

    // Track mouse position
    map.on('mousemove', (e) => {
      cursorLng = Math.round(e.lngLat.lng * 10000) / 10000;
      cursorLat = Math.round(e.lngLat.lat * 10000) / 10000;
    });

    // Initial layer info update
    updateLayerInfo();

    // Set up interval for live updates
    setInterval(updateLayerInfo, 1000);

    listenersRegistered = true;
  });

  const updateLayerInfo = () => {
    if (!map) return;

    const style = map.getStyle();
    if (!style) return;

    // Get all sources
    const sourceEntries = Object.entries(style.sources || {});
    const newSources: SourceInfo[] = [];

    for (const [name] of sourceEntries) {
      const isInternal = name.startsWith('gm_');
      let featureCount = 0;

      try {
        const source = map.getSource(name);
        if (source && 'serialize' in source) {
          const serialized = (source as { serialize: () => { data?: { features?: unknown[] } } }).serialize();
          if (serialized?.data && 'features' in serialized.data) {
            featureCount = (serialized.data.features as unknown[])?.length || 0;
          }
        }
      } catch {
        // Some sources don't support serialize
      }

      newSources.push({
        name,
        featureCount,
        isInternal,
      });
    }

    // Sort: gm_ sources first, then alphabetically
    newSources.sort((a, b) => {
      if (a.isInternal && !b.isInternal) return -1;
      if (!a.isInternal && b.isInternal) return 1;
      return a.name.localeCompare(b.name);
    });

    sources = newSources;

    // Get all layers
    const newLayers: LayerInfo[] = (style.layers || []).map((layer) => ({
      id: layer.id,
      type: layer.type,
      source: 'source' in layer ? String(layer.source) : '',
      isInternal: layer.id.startsWith('gm_') || ('source' in layer && String(layer.source).startsWith('gm_')),
    }));

    layers = newLayers;

    lastLayerUpdate = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const updateDebugInfo = () => {
    if (!geoman) return;

    const drawModes = geoman.getActiveDrawModes();
    const editModes = geoman.getActiveEditModes();

    if (drawModes.length > 0) {
      currentMode = `draw:${drawModes.join(',')}`;
    } else if (editModes.length > 0) {
      currentMode = `edit:${editModes.join(',')}`;
    } else {
      currentMode = 'none';
    }

    try {
      const geoJson = geoman.features.exportGeoJson();
      featureCount = geoJson?.features?.length || 0;
    } catch {
      featureCount = 0;
    }
  };

  // Shape loaders
  const loadCommonShapes = () => {
    if (!geoman) return;
    geoman.features.importGeoJson({
      type: 'FeatureCollection',
      features: commonShapes as GeoJsonImportFeature[],
    });
    updateDebugInfo();
    logEvent('shapes:loaded', { type: 'common-shapes', count: commonShapes.length });
  };

  const loadOneOfEach = () => {
    if (!geoman) return;
    geoman.features.importGeoJson({
      type: 'FeatureCollection',
      features: oneOfEachShape as GeoJsonImportFeature[],
    });
    updateDebugInfo();
    logEvent('shapes:loaded', { type: 'one-of-each', count: oneOfEachShape.length });
  };

  const loadStressTest = () => {
    if (!geoman) return;
    loadStressTestFeatureCollection(geoman, 0.5, 0.4);
    updateDebugInfo();
    logEvent('shapes:loaded', { type: 'stress-test-polygons' });
  };

  const loadMarkerStressTest = () => {
    if (!geoman) return;
    loadStressTestCircleMarkers(geoman, 0.5);
    updateDebugInfo();
    logEvent('shapes:loaded', { type: 'stress-test-markers' });
  };

  const clearAllShapes = () => {
    if (!geoman) return;
    const count = geoman.features.featureStore.size;
    geoman.features.deleteAll();
    updateDebugInfo();
    logEvent('shapes:cleared', { count });
  };

  // GeoJSON tools
  const exportGeoJson = () => {
    if (!geoman) return;
    const geoJson = geoman.features.exportGeoJson();
    geojsonInput = prettyPrint ? JSON.stringify(geoJson, null, 2) : JSON.stringify(geoJson);
    logEvent('geojson:exported', { featureCount: geoJson?.features?.length || 0 });
  };

  const copyToClipboard = () => {
    if (!geoman) return;
    const geoJson = geoman.features.exportGeoJson();
    const text = prettyPrint ? JSON.stringify(geoJson, null, 2) : JSON.stringify(geoJson);
    navigator.clipboard.writeText(text);
    logEvent('geojson:copied', { featureCount: geoJson?.features?.length || 0 });
  };

  const importGeoJson = () => {
    if (!geoman || !geojsonInput.trim()) return;
    try {
      const parsed = JSON.parse(geojsonInput);
      geoman.features.importGeoJson(parsed);
      updateDebugInfo();
      logEvent('geojson:imported', { featureCount: parsed?.features?.length || 1 });
    } catch (e) {
      logEvent('geojson:import-error', { error: String(e) });
    }
  };

  const clearGeoJsonInput = () => {
    geojsonInput = '';
  };

  const getSourceGeojson = () => {
    if (!geoman) return;
    const source = geoman.features.sources['gm_main'];
    if (!source) {
      logEvent('source:geojson-error', { error: 'gm_main source not found' });
      return;
    }
    const geoJson = source.getGeoJson();
    geojsonInput = prettyPrint ? JSON.stringify(geoJson, null, 2) : JSON.stringify(geoJson);
    logEvent('source:geojson', { source: 'gm_main', featureCount: geoJson?.features?.length || 0 });
  };
</script>

<div class="dev-panel-header">
  <span>Data & Debugging</span>
</div>

<div class="dev-panel-content">
  <!-- Layer Summary Section -->
  <div class="dev-section">
    <div
      class="dev-section-header"
      class:collapsed={!layersExpanded}
      onclick={() => toggleSection('layers')}
      onkeydown={(e) => e.key === 'Enter' && toggleSection('layers')}
      role="button"
      tabindex="0"
    >
      <span>Sources & Layers</span>
      <span class="toggle-icon">&#9660;</span>
    </div>
    <div class="dev-section-content" class:collapsed={!layersExpanded}>
      <div class="dev-layer-summary">
        <!-- Geoman Sources -->
        <div class="dev-layer-group">
          <div
            class="dev-layer-group-header internal clickable"
            class:collapsed={!gmSourcesExpanded}
            onclick={() => gmSourcesExpanded = !gmSourcesExpanded}
            onkeydown={(e) => e.key === 'Enter' && (gmSourcesExpanded = !gmSourcesExpanded)}
            role="button"
            tabindex="0"
          >
            <span><span class="toggle-icon">&#9660;</span> Geoman Sources</span>
            <span class="count">{sources.filter(s => s.isInternal).reduce((sum, s) => sum + s.featureCount, 0)}</span>
          </div>
          {#if gmSourcesExpanded}
            {#each sources.filter(s => s.isInternal) as source}
              <div class="dev-layer-item internal">
                <span class="name">{source.name}</span>
                <span class="count">{source.featureCount} features</span>
              </div>
            {/each}
            {#if sources.filter(s => s.isInternal).length === 0}
              <div class="dev-layer-item">
                <span class="name" style="color: #888; font-style: italic;">No Geoman sources</span>
              </div>
            {/if}
          {/if}
        </div>

        <!-- Other Sources -->
        <div class="dev-layer-group">
          <div
            class="dev-layer-group-header clickable"
            class:collapsed={!otherSourcesExpanded}
            onclick={() => otherSourcesExpanded = !otherSourcesExpanded}
            onkeydown={(e) => e.key === 'Enter' && (otherSourcesExpanded = !otherSourcesExpanded)}
            role="button"
            tabindex="0"
          >
            <span><span class="toggle-icon">&#9660;</span> Other Sources</span>
            <span class="count">{sources.filter(s => !s.isInternal).length}</span>
          </div>
          {#if otherSourcesExpanded}
            {#each sources.filter(s => !s.isInternal) as source}
              <div class="dev-layer-item">
                <span class="name">{source.name}</span>
                <span class="count">{source.featureCount > 0 ? `${source.featureCount} features` : '-'}</span>
              </div>
            {/each}
            {#if sources.filter(s => !s.isInternal).length === 0}
              <div class="dev-layer-item">
                <span class="name" style="color: #888; font-style: italic;">No other sources</span>
              </div>
            {/if}
          {/if}
        </div>

        <!-- Geoman Layers -->
        <div class="dev-layer-group">
          <div
            class="dev-layer-group-header internal clickable"
            class:collapsed={!gmLayersExpanded}
            onclick={() => gmLayersExpanded = !gmLayersExpanded}
            onkeydown={(e) => e.key === 'Enter' && (gmLayersExpanded = !gmLayersExpanded)}
            role="button"
            tabindex="0"
          >
            <span><span class="toggle-icon">&#9660;</span> Geoman Layers</span>
            <span class="count">{layers.filter(l => l.isInternal).length}</span>
          </div>
          {#if gmLayersExpanded}
            {#each layers.filter(l => l.isInternal) as layer}
              <div class="dev-layer-item internal">
                <span class="name">{layer.id}</span>
                <span class="count">{layer.type}</span>
              </div>
            {/each}
            {#if layers.filter(l => l.isInternal).length === 0}
              <div class="dev-layer-item">
                <span class="name" style="color: #888; font-style: italic;">No Geoman layers</span>
              </div>
            {/if}
          {/if}
        </div>

        <!-- Other Layers -->
        <div class="dev-layer-group">
          <div
            class="dev-layer-group-header clickable"
            class:collapsed={!otherLayersExpanded}
            onclick={() => otherLayersExpanded = !otherLayersExpanded}
            onkeydown={(e) => e.key === 'Enter' && (otherLayersExpanded = !otherLayersExpanded)}
            role="button"
            tabindex="0"
          >
            <span><span class="toggle-icon">&#9660;</span> Other Layers</span>
            <span class="count">{layers.filter(l => !l.isInternal).length}</span>
          </div>
          {#if otherLayersExpanded}
            {#each layers.filter(l => !l.isInternal).slice(0, 10) as layer}
              <div class="dev-layer-item">
                <span class="name">{layer.id}</span>
                <span class="count">{layer.type}</span>
              </div>
            {/each}
            {#if layers.filter(l => !l.isInternal).length > 10}
              <div class="dev-layer-item">
                <span class="name" style="color: #888; font-style: italic;">...and {layers.filter(l => !l.isInternal).length - 10} more</span>
              </div>
            {/if}
          {/if}
        </div>
      </div>
      <div class="dev-refresh-indicator">Last update: {lastLayerUpdate}</div>
      <button class="dev-btn" onclick={updateLayerInfo}>Refresh Now</button>
    </div>
  </div>

  <!-- Shape Loaders Section -->
  <div class="dev-section">
    <div
      class="dev-section-header"
      class:collapsed={!shapesExpanded}
      onclick={() => toggleSection('shapes')}
      onkeydown={(e) => e.key === 'Enter' && toggleSection('shapes')}
      role="button"
      tabindex="0"
    >
      <span>Shape Loaders</span>
      <span class="toggle-icon">&#9660;</span>
    </div>
    <div class="dev-section-content" class:collapsed={!shapesExpanded}>
      <div class="dev-btn-row">
        <button class="dev-btn" onclick={loadCommonShapes}>Common Shapes</button>
        <button class="dev-btn" onclick={loadOneOfEach}>One of Each</button>
      </div>
      <div class="dev-btn-row">
        <button class="dev-btn" onclick={loadStressTest}>Polygon Grid</button>
        <button class="dev-btn" onclick={loadMarkerStressTest}>Marker Grid</button>
      </div>
      <div class="dev-btn-row">
        <button class="dev-btn danger" onclick={clearAllShapes}>Clear All Shapes</button>
      </div>
    </div>
  </div>

  <!-- GeoJSON Tools Section -->
  <div class="dev-section">
    <div
      class="dev-section-header"
      class:collapsed={!geojsonExpanded}
      onclick={() => toggleSection('geojson')}
      onkeydown={(e) => e.key === 'Enter' && toggleSection('geojson')}
      role="button"
      tabindex="0"
    >
      <span>GeoJSON Tools</span>
      <span class="toggle-icon">&#9660;</span>
    </div>
    <div class="dev-section-content" class:collapsed={!geojsonExpanded}>
      <div class="dev-btn-row">
        <button class="dev-btn" onclick={exportGeoJson}>Dump GeoJSON</button>
        <button class="dev-btn" onclick={copyToClipboard}>Copy to Clipboard</button>
      </div>
      <div class="dev-btn-row">
        <button class="dev-btn" onclick={getSourceGeojson}>Get Source GeoJSON (gm_main)</button>
      </div>
      <div class="dev-control-row">
        <label for="pretty-print">Pretty Print</label>
        <label class="dev-toggle">
          <input type="checkbox" id="pretty-print" bind:checked={prettyPrint} />
          <span class="dev-toggle-slider"></span>
        </label>
      </div>
      <textarea
        class="dev-textarea"
        bind:value={geojsonInput}
        placeholder="Paste GeoJSON here to import..."
      ></textarea>
      <div class="dev-btn-row">
        <button class="dev-btn primary" onclick={importGeoJson}>Import GeoJSON</button>
        <button class="dev-btn" onclick={clearGeoJsonInput}>Clear</button>
      </div>
    </div>
  </div>

  <!-- Event Logger Section -->
  <div class="dev-section">
    <div
      class="dev-section-header"
      class:collapsed={!eventsExpanded}
      onclick={() => toggleSection('events')}
      onkeydown={(e) => e.key === 'Enter' && toggleSection('events')}
      role="button"
      tabindex="0"
    >
      <span>Event Logger</span>
      <span class="toggle-icon">&#9660;</span>
    </div>
    <div class="dev-section-content" class:collapsed={!eventsExpanded}>
      <div class="dev-control-row">
        <label for="event-logging">Enable Logging</label>
        <label class="dev-toggle">
          <input type="checkbox" id="event-logging" bind:checked={eventLoggingEnabled} />
          <span class="dev-toggle-slider"></span>
        </label>
      </div>
      <div class="dev-filter-row">
        <button
          class="dev-filter-btn"
          class:active={eventFilters.create}
          onclick={() => toggleEventFilter('create')}
        >
          create
        </button>
        <button
          class="dev-filter-btn"
          class:active={eventFilters.update}
          onclick={() => toggleEventFilter('update')}
        >
          update
        </button>
        <button
          class="dev-filter-btn"
          class:active={eventFilters.remove}
          onclick={() => toggleEventFilter('remove')}
        >
          remove
        </button>
        <button
          class="dev-filter-btn"
          class:active={eventFilters.draw}
          onclick={() => toggleEventFilter('draw')}
        >
          draw
        </button>
        <button
          class="dev-filter-btn"
          class:active={eventFilters.edit}
          onclick={() => toggleEventFilter('edit')}
        >
          edit
        </button>
        <button
          class="dev-filter-btn"
          class:active={eventFilters.mode}
          onclick={() => toggleEventFilter('mode')}
        >
          mode
        </button>
      </div>
      <div class="dev-event-log">
        {#each eventLog as event (event.id)}
          <div class="dev-event-log-item">
            <span class="dev-event-log-time">{event.time}</span>
            <span class="dev-event-log-name">{event.name}</span>
            {#if event.data}
              <span class="dev-event-log-data">{event.data}</span>
            {/if}
          </div>
        {/each}
        {#if eventLog.length === 0}
          <div class="dev-feature-info-empty">No events logged yet</div>
        {/if}
      </div>
      <button class="dev-btn" onclick={clearEventLog}>Clear Log</button>
    </div>
  </div>

  <!-- Debug Info Section -->
  <div class="dev-section">
    <div
      class="dev-section-header"
      class:collapsed={!debugExpanded}
      onclick={() => toggleSection('debug')}
      onkeydown={(e) => e.key === 'Enter' && toggleSection('debug')}
      role="button"
      tabindex="0"
    >
      <span>Debug Info</span>
      <span class="toggle-icon">&#9660;</span>
    </div>
    <div class="dev-section-content" class:collapsed={!debugExpanded}>
      <div class="dev-debug-info">
        <div class="dev-debug-row">
          <span class="dev-debug-label">Current Mode</span>
          <span class="dev-debug-value">{currentMode}</span>
        </div>
        <div class="dev-debug-row">
          <span class="dev-debug-label">Feature Count</span>
          <span class="dev-debug-value">{featureCount}</span>
        </div>
        <div class="dev-debug-row">
          <span class="dev-debug-label">Cursor (lng)</span>
          <span class="dev-debug-value">{cursorLng}</span>
        </div>
        <div class="dev-debug-row">
          <span class="dev-debug-label">Cursor (lat)</span>
          <span class="dev-debug-value">{cursorLat}</span>
        </div>
      </div>
      <button class="dev-btn" onclick={updateDebugInfo}>Refresh</button>
    </div>
  </div>
</div>

<div class="dev-shortcuts-hint">
  <kbd>Ctrl</kbd>+<kbd>2</kbd> Toggle right panel
</div>
