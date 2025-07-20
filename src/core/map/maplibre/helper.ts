import type { GeoJsonDiffStorage } from "@/types";
import type { Feature } from "geojson"

export function mergeGeoJsonDiff(
  pendingDiffOrNull: GeoJsonDiffStorage | null,
  nextDiffOrNull: GeoJsonDiffStorage | null
): GeoJsonDiffStorage {
  const pending: GeoJsonDiffStorage = pendingDiffOrNull ?? {add: [], update: [], remove: []}
  const next: GeoJsonDiffStorage = nextDiffOrNull ?? {add: [], update: [], remove: []}

  const nextRemoveIds = new Set(next.remove);

  const pendingAdd = pending.add.filter((f) => !nextRemoveIds.has(f.id!))
  const pendingUpdate = pending.update.filter((f) => !nextRemoveIds.has(f.id!))

  const nextUpdate: Array<Feature> = [];

  next.update.forEach((updatedFeature) => {
    const pendingAddIdx = pendingAdd.findIndex(f => f.id === updatedFeature.id)
    const pendingUpdateIdx = pendingUpdate.findIndex(f => f.id === updatedFeature.id)

    if (pendingAddIdx === -1 && pendingUpdateIdx === -1) {
      nextUpdate.push(updatedFeature)
      return
    }
    if (pendingAddIdx !== -1) {
      pendingAdd[pendingAddIdx] = updatedFeature;
    }
    if (pendingUpdateIdx !== -1) {
      pendingUpdate[pendingUpdateIdx] = updatedFeature;
    }
  });

  return {
    add: [...pendingAdd, ...next.add],
    update: [...pendingUpdate, ...nextUpdate],
    remove: [...pending.remove, ...next.remove]
  }
}
