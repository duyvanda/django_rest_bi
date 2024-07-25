import L from "leaflet";
import iconUrl from "./../images/marker-icon-green.png"
import iconShadow from "./../images/marker-shadow.png"
import iconUrlRed from "./../images/marker-icon-red.png"


const { shadowSize, iconAnchor, popupAnchor, tooltipAnchor } = L.Marker.prototype.options.icon.options

console.log(L.Marker.prototype.options.icon.options);

export const defaultIcon = L.icon(
    {
        iconUrl, 
        iconShadow, 
        iconSize: [30, 30], 
        shadowSize, 
        iconAnchor, 
        popupAnchor, 
        tooltipAnchor
    }
)

export const RedIcon = L.icon(
    {
        iconUrl: iconUrlRed, 
        iconShadow, 
        iconSize: [30, 30], 
        shadowSize, 
        iconAnchor, 
        popupAnchor, 
        tooltipAnchor
    }
)

// export const BlueIcon = L.BeautifyIcon.icon(
//     {
//         icon: 'leaf',
//         iconShape: 'marker'
//     }
// ) 

// https://icon-icons.com/download/34392/PNG/64/