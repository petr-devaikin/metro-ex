var mskCentreLat = 55.7522200,
    mskCentreLong = 37.6155600,
    defaultZoom = 20;

function toKm(latitude, longitude, zoom) {
    var kmInLat = 111.35,
        kmInLong = 62.79;

    if (zoom === undefined)
        zoom = defaultZoom;

    return {
        x: (longitude - mskCentreLong) * kmInLong * zoom,
        y: -(latitude - mskCentreLat) * kmInLat * zoom,
    }
}