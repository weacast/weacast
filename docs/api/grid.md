# Grid

Most forecast data are distributed as gridded data, which is two-dimensional data representing a forecast element value along an evenly spaced matrix of geographical positions. Usually, the grid has a longitude (x-axis or width) and a latitude (y-axis or height) dimension and is computed using the [Equirectangular projection](https://en.wikipedia.org/wiki/Equirectangular_projection) with a constant spacing called the **resolution** of the grid.

> The values of the element are assumed to be the one measured at the grid vertices.

You can use the **Grid** class to compute forecast element value at any location from input gridded data (a process called [interpolation](https://en.wikipedia.org/wiki/Bilinear_interpolation)) like this:
```javascript
let grid = new Grid({
      bounds: [-180, -90, 180, 90],
      origin: [-180, 90],
      size: [2, 2],
      resolution: [180, 90],
      data
    })
let value = grid.interpolate(longitude, latitude)
```

## Grid API

### Grid(options)

Constructor of a grid object, required properties of the **options** object are the following:
* **bounds** : the geographical bounds covered by the grid as an array of decimal values `[min longitude, min latitude, max longitude, max latitude]`,
* **origin** : the geographical origin of the data grid as an array of decimal values `[longitude origin, latitude origin]`,
* **size** : the size of the data grid as an array of integer values `[width, height]`,
* **resolution** : the geographical resolution of the data grid as an array of decimal values `[longitude resolution, latitude resolution]`
* **data** : the gridded data as a JavaScript array

### .interpolate(longitude, latitude)

Return the interpolated value at given longitude (in range [-180, 180]) and latitude (in range [-90, 90])

### .resample(origin, resolution, size)

Return the interpolated values for a new grid defined by:
* **origin** : the geographical origin of the data grid as an array of decimal values `[longitude origin, latitude origin]`,
* **size** : the size of the data grid as an array of integer values `[width, height]`,
* **resolution** : the geographical resolution of the data grid as an array of decimal values `[longitude resolution, latitude resolution]`

