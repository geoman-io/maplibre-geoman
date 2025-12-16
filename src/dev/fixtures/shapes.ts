import {
  FEATURE_ID_PROPERTY,
  type GeoJsonImportFeature,
  type GeoJsonImportFeatureCollection,
  type Geoman,
  type LngLatTuple,
} from '@/main.ts';
import log from 'loglevel';

export const loadStressTestFeatureCollection = (geoman: Geoman, step: number, size: number) => {
  const targetSource = geoman.features.sources.gm_main;
  if (!targetSource) {
    log.error('Target source is not available');
    return;
  }

  const geoJson: GeoJsonImportFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  const createPolygonFeature = (coords: Array<LngLatTuple>): GeoJsonImportFeature => {
    const featureId = `${coords[0][0]}-${coords[0][1]}`;
    return {
      id: featureId,
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords],
      },
      properties: {
        [FEATURE_ID_PROPERTY]: featureId,
        shape: 'rectangle',
      },
    };
  };

  for (let lng = -10; lng < 10; lng += step) {
    for (let lat = 56; lat > 46; lat -= step) {
      const feature = createPolygonFeature([
        [lng, lat],
        [lng + size, lat],
        [lng + size, lat - size],
        [lng, lat - size],
        [lng, lat],
      ]);

      geoJson.features.push(feature);
    }
  }

  log.debug('Total feature count', geoJson.features.length);
  const currentGeoJson = targetSource.getGeoJson();
  geoJson.features = geoJson.features.concat(
    currentGeoJson.features as Array<GeoJsonImportFeature>,
  );
  geoman.features.importGeoJson(geoJson);
};

export const loadStressTestCircleMarkers = (geoman: Geoman, step: number) => {
  const geoJson: GeoJsonImportFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  const createCircleMarkerFeature = (lngLat: LngLatTuple): GeoJsonImportFeature => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: lngLat,
      },
      properties: {
        shape: 'circle_marker',
      },
    };
  };

  for (let lng = -10; lng < 10; lng += step) {
    for (let lat = 56; lat > 46; lat -= step) {
      const feature = createCircleMarkerFeature([lng, lat]);
      geoJson.features.push(feature);
    }
  }

  log.debug('total features count', geoJson.features.length);
  geoman.features.importGeoJson(geoJson);
};

export const loadDevShapes = (geoman: Geoman, devShapes: Array<GeoJsonImportFeature>) => {
  // const result = geoman.features.importGeoJson({
  //   type: 'FeatureCollection',
  //   features: devShapes,
  // });
  // log.debug(result);

  devShapes.forEach((shapeGeoJson, index) => {
    const allowedFeatureIds: Array<number> = [11, 12];
    // const allowedFeatureIds: Array<number> = [1];
    // const allowedFeatureIds: Array<number> = Array(10).fill(0).map((_, i) => i).slice(3);

    if (allowedFeatureIds.length) {
      if (allowedFeatureIds.includes(index)) {
        geoman.features.importGeoJson(shapeGeoJson);
      }
    } else {
      geoman.features.importGeoJson(shapeGeoJson);
    }
  });
};

export const loadExternalGeoJson = (geoman: Geoman) => {
  const capitalsUrl =
    'https://raw.githubusercontent.com' +
    '/Stefie/geojson-world/46cbac88be743326b247baee180928683d0afe9f/capitals.geojson';

  const loadCapitals = async () => {
    const response = await fetch(capitalsUrl);
    const data = await response.json();
    geoman.features.importGeoJson(data);
  };

  loadCapitals().then();
};

export const devShapes: Array<GeoJsonImportFeature> = [
  {
    id: 'feature-1 [line]',
    type: 'Feature',
    properties: {
      shape: 'line',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [5.8, 53.3],
        [9.6, 54.1],
        [9.5, 52.7],
        [7.3, 51.9],
        [7.4, 49.6],
        [7.9, 49.3],
        [9.2, 49.0],
      ],
    },
  },
  {
    type: 'Feature',
    properties: {
      shape: 'polygon',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-67.13734, 45.13745],
          [-66.96466, 44.8097],
          [-68.03252, 44.3252],
          [-69.06, 43.98],
          [-70.11617, 43.68405],
          [-70.64573, 43.09008],
          [-70.75102, 43.08003],
          [-70.79761, 43.21973],
          [-70.98176, 43.36789],
          [-70.94416, 43.46633],
          [-71.08482, 45.30524],
          [-70.66002, 45.46022],
          [-70.30495, 45.91479],
          [-70.00014, 46.69317],
          [-69.23708, 47.44777],
          [-68.90478, 47.18479],
          [-68.2343, 47.35462],
          [-67.79035, 47.06624],
          [-67.79141, 45.70258],
          [-67.13734, 45.13745],
        ],
      ],
    },
  },
  {
    id: 'feature-2 [polygon]',
    type: 'Feature',
    properties: {
      shape: 'polygon',
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [0.2, 54.4],
            [0.010986328124147349, 52.31526437316501],
            [1.6809082031246305, 52.67645062427434],
            [3.4606933593746305, 53.4161475808215],
            [5.1, 49.9],
            [0.3, 48.4],
            [-4.7, 49.8],
            [-4.7, 52.6],
            [-3.3508300781251137, 54.31018029169337],
            [0.2, 54.4],
          ],
        ],
      ],
    },
  },
  {
    id: 'feature-3 [polygon]',
    type: 'Feature',
    properties: {
      shape: 'polygon',
      exclusive: true,
      s55: 'x4',
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-8.151855468751137, 49.446665467090696],
            [-6.240234375000625, 50.701270850707886],
            [-5.84472656250108, 48.27618657276568],
            [-0.32958984375139266, 50.23991030183703],
            [-1.0327148437511937, 47.4657730052308],
            [-5.3833007812507105, 47.5399711350812],
            [-3.71337890625054, 45.8068303227102],
            [-7.272949218750938, 45.85274957172851],
            [-6.30615234375054, 47.063289242347594],
            [-9.272460937500739, 47.450920787747776],
            [-8.151855468751137, 49.446665467090696],
          ],
        ],
      ],
    },
  },
  {
    id: 'feature-4 [polygon]',
    type: 'Feature',
    properties: {
      shape: 'polygon',
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-1.0327148437511937, 47.4657730052308],
            [-0.32958984375048317, 44.91441867979589],
            [4.086914062499858, 44.883363527737],
            [4.0649414062496305, 47.596109058677456],
            [2.1093749999994316, 45.80768783328844],
            [-1.0327148437511937, 47.4657730052308],
          ],
        ],
      ],
    },
  },
  {
    id: 'feature-5 [line]',
    type: 'Feature',
    properties: {
      shape: 'line',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [8.066112706307223, 50.09951350370815],
        [0.8371088000576208, 51.20007067104231],
        [-3.8210943249421803, 50.785173158527215],
        [-9.09667968750037, 52.62312868529875],
        [-6.240234375000625, 50.701270850707886],
      ],
    },
  },
  {
    id: 'feature-6 [line]',
    type: 'Feature',
    properties: {
      shape: 'line',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [4.0649414062496305, 47.596109058677456],
        [8.483593175057877, 48.04144065831264],
        [11.471874425057536, 49.71744949771036],
        [8.066112706307223, 50.09951350370815],
        [10.307323643807337, 51.59761788162879],
        [7.492675781250114, 52.649797782555794],
        [7.2949218750003695, 53.32937254966237],
      ],
    },
  },
  {
    id: 'feature-7 [polygon]',
    type: 'Feature',
    properties: {
      shape: 'polygon',
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [7.2949218750003695, 53.32937254966237],
            [8.349609375000057, 55.328460348876405],
            [6.306152343749744, 55.75417761297058],
            [4.196777343750341, 54.06273427587078],
            [3.735351562499943, 52.690676845687534],
            [5.734863281249773, 53.39536597961512],
            [6.943359374999574, 54.770738835342144],
            [5.778808593750341, 52.556435933745405],
            [7.2949218750003695, 53.32937254966237],
          ],
        ],
      ],
    },
  },
  {
    id: 'feature-8 [line]',
    type: 'Feature',
    properties: {
      shape: 'line',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [4.196777343750341, 54.06273427587078],
        [-2.448110739533153, 54.10397534490192],
        [-2.0214843750000853, 53.16660127282023],
        [-3.9550781249999716, 52.435989503713074],
        [-9.09667968750037, 52.62312868529875],
      ],
    },
  },
  {
    id: 'feature-9 [circle]',
    type: 'Feature',
    properties: {
      shape: 'circle',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-4.218750000000568, 55.67057839708106],
          [-4.375043543347101, 55.6670163661763],
          [-4.530289756981725, 55.65635417237558],
          [-4.683450052480002, 55.6386633113205],
          [-4.833503200197152, 55.61406227502233],
          [-4.979453702557503, 55.582715560975075],
          [-5.120339809356924, 55.54483230501167],
          [-5.255241070857345, 55.500664557308646],
          [-5.383285336537762, 55.450505225539054],
          [-5.50365512145785, 55.39468571311376],
          [-5.615593277708108, 55.33357328366132],
          [-5.718407924752654, 55.26756818532237],
          [-5.811476609008838, 55.197100570060066],
          [-5.894249679177125, 55.12262724402566],
          [-5.9662528791217815, 55.044628285105524],
          [-6.02708917407504, 54.96360356317838],
          [-6.07643983825679, 54.88006919740707],
          [-6.114064842431674, 54.79455398317384],
          [-6.139802588329244, 54.707595819141574],
          [-6.153569043189276, 54.61973816248874],
          [-6.1553563320059475, 54.531526537724],
          [-6.145230847444747, 54.44350512173266],
          [-6.123330938062902, 54.356213424924654],
          [-6.089864234585981, 54.27018308561901],
          [-6.045104671811553, 54.185934792173924],
          [-5.989389260467984, 54.10397534490192],
          [-5.923114659292729, 54.02479486753645],
          [-5.846733592939374, 53.94886417596052],
          [-5.760751156287039, 53.87663231008692],
          [-5.665721040497286, 53.808524233196785],
          [-5.5622417109040825, 53.744938701697215],
          [-5.450952561666618, 53.6862463071396],
          [-5.332530067171152, 53.632787691436334],
          [-5.2076839455207065, 53.58487193550753],
          [-5.077153345161774, 53.54277512106183],
          [-4.941703061808083, 53.50673906484856],
          [-4.802119789359413, 53.47697022449019],
          [-4.659208405492699, 53.45363877489613],
          [-4.513788290027848, 53.43687785425117],
          [-4.366689672040303, 53.426782978648006],
          [-4.218750000000568, 53.42341162457317],
          [-4.070810327960834, 53.426782978648006],
          [-3.9237117099732903, 53.43687785425117],
          [-3.7782915945084383, 53.45363877489613],
          [-3.6353802106417232, 53.47697022449019],
          [-3.495796938193056, 53.50673906484855],
          [-3.3603466548393643, 53.54277512106183],
          [-3.229816054480431, 53.58487193550753],
          [-3.104969932829986, 53.632787691436334],
          [-2.9865474383345196, 53.6862463071396],
          [-2.8752582890970544, 53.744938701697215],
          [-2.771778959503852, 53.808524233196785],
          [-2.676748843714097, 53.87663231008692],
          [-2.5907664070617633, 53.94886417596052],
          [-2.5143853407084076, 54.02479486753645],
          [-2.448110739533153, 54.10397534490192],
          [-2.392395328189584, 54.185934792173924],
          [-2.347635765415156, 54.27018308561901],
          [-2.314169061938235, 54.356213424924654],
          [-2.2922691525563907, 54.44350512173266],
          [-2.2821436679951894, 54.531526537724],
          [-2.283930956811862, 54.61973816248874],
          [-2.2976974116718925, 54.707595819141574],
          [-2.323435157569463, 54.79455398317384],
          [-2.3610601617443474, 54.88006919740707],
          [-2.4104108259260975, 54.96360356317838],
          [-2.471247120879355, 55.044628285105524],
          [-2.5432503208240136, 55.12262724402566],
          [-2.6260233909922985, 55.197100570060066],
          [-2.7190920752484837, 55.26756818532237],
          [-2.82190672229303, 55.33357328366132],
          [-2.9338448785432854, 55.39468571311376],
          [-3.054214663463375, 55.450505225539054],
          [-3.182258929143793, 55.500664557308646],
          [-3.3171601906442127, 55.54483230501167],
          [-3.4580462974436346, 55.58271556097508],
          [-3.603996799803985, 55.61406227502233],
          [-3.754049947521134, 55.6386633113205],
          [-3.907210243019412, 55.65635417237558],
          [-4.062456456654035, 55.6670163661763],
          [-4.218750000000568, 55.67057839708106],
        ],
      ],
    },
  },
  {
    id: 'feature-10 [polygon]',
    type: 'Feature',
    properties: {
      shape: 'polygon',
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-0.49438476562519895, 52.68977095060066],
            [-1.988525390625881, 52.23459752888894],
            [-0.6921386718751137, 51.501974479325014],
            [0.4504394531241189, 52.248052198969134],
            [2.142333984374716, 52.04580356911538],
            [1.0876464843740337, 52.99501831280071],
            [0.2526855468742326, 52.529658772965206],
            [-0.49438476562519895, 52.68977095060066],
          ],
        ],
      ],
    },
  },
  {
    id: 'feature-11 [line]',
    type: 'Feature',
    properties: {
      shape: 'line',
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [3.4606933593746305, 51.77470820762835],
        [4.141845703124716, 51.44723080318926],
        [3.218994140624602, 51.15874776487169],
        [4.185791015624034, 50.72957305948492],
        [2.6477050781240905, 50.50651173029772],
      ],
    },
  },
];
