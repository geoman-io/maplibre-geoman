// extracted from maplibre repo : src/source/geojson_source_diff.ts

import type { GeoJSONFeatureDiff, GeoJSONSourceDiff } from 'maplibre-gl';

export function mergeSourceDiffs(
  existingDiff: GeoJSONSourceDiff | undefined,
  newDiff: GeoJSONSourceDiff | undefined,
): GeoJSONSourceDiff {
  if (!existingDiff) {
    return newDiff ?? {};
  }

  if (!newDiff) {
    return existingDiff;
  }

  let merged: GeoJSONSourceDiff = { ...existingDiff };

  if (newDiff.removeAll) {
    merged = { removeAll: true };
  }

  if (newDiff.remove) {
    const newRemovedSet = new Set(newDiff.remove);
    if (merged.add) {
      merged.add = merged.add.filter((f) => !newRemovedSet.has(f.id!));
    }
    if (merged.update) {
      merged.update = merged.update.filter((f) => !newRemovedSet.has(f.id));
    }

    const existingAddSet = new Set((existingDiff.add ?? []).map((f) => f.id));
    newDiff.remove = newDiff.remove.filter((id) => !existingAddSet.has(id));
  }

  if (newDiff.remove) {
    const removedSet = new Set(
      merged.remove ? merged.remove.concat(newDiff.remove) : newDiff.remove,
    );
    merged.remove = Array.from(removedSet.values());
  }

  if (newDiff.add) {
    const combinedAdd = merged.add ? merged.add.concat(newDiff.add) : newDiff.add;
    const addMap = new Map(combinedAdd.map((feature) => [feature.id, feature]));
    merged.add = Array.from(addMap.values());
  }

  if (newDiff.update) {
    const updateMap = new Map(merged.update?.map((feature) => [feature.id, feature]));
    for (const feature of newDiff.update) {
      const featureUpdate =
        updateMap.get(feature.id) ?? ({ id: feature.id } satisfies GeoJSONFeatureDiff);

      if (feature.newGeometry) {
        featureUpdate.newGeometry = feature.newGeometry;
      }
      if (feature.addOrUpdateProperties) {
        featureUpdate.addOrUpdateProperties = (featureUpdate.addOrUpdateProperties ?? []).concat(
          feature.addOrUpdateProperties,
        );
      }
      if (feature.removeProperties) {
        featureUpdate.removeProperties = (featureUpdate.removeProperties ?? []).concat(
          feature.removeProperties,
        );
      }
      if (feature.removeAllProperties) {
        featureUpdate.removeAllProperties = true;
      }

      updateMap.set(feature.id, featureUpdate);
    }

    merged.update = Array.from(updateMap.values());
  }

  if (merged.remove && merged.add) {
    merged.remove = merged.remove.filter((id) => merged.add!.findIndex((f) => f.id === id) === -1);
  }

  return merged;
}
