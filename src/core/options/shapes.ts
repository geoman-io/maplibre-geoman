export const customShapeTriangle = {
  type: 'Feature',
  properties: {
    shape: 'polygon',
  },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [
            4.0,
            51.2,
          ],
          [
            5.4,
            52.4,
          ],
          [
            6.8,
            51.2,
          ],
          [
            4.0,
            51.2,
          ],
        ],
      ],
    ],
  },
};

export const customShapeRectangle = {
  type: 'Feature',
  properties: {
    shape: 'rectangle',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [
          -0.47,
          51.67,
        ],
        [
          1.43,
          51.67,
        ],
        [
          1.43,
          53.32,
        ],
        [
          -0.47,
          53.32,
        ],
        [
          -0.47,
          51.67,
        ],
      ],
    ],
  },
};
