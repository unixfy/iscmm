<script>
    import "../app.css";
    import {onMount, onDestroy} from 'svelte';
    import {browser} from '$app/environment';

    export let data;

    let mapElement;
    let map;

    onMount(async () => {
        if (browser) {
            const leaflet = await import('leaflet');

            // Start centered at 7th St/Metro Center in Downtown Los Angeles
            map = leaflet.map(mapElement, {preferCanvas: true}).setView([34.0488664, -118.2613463], 12);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            let exits = await data.streamed.exits
            console.log(exits)

            // add each exit to the map
            exits.forEach(exit => {
                leaflet.circleMarker([exit.lat, exit.lon]).addTo(map);
            })

        }
    });

    onDestroy(async () => {
        if (map) {
            map.remove();
        }
    });
</script>

<style>
    @import 'leaflet/dist/leaflet.css';
</style>
<div class="h-screen w-screen">
    <div bind:this={mapElement} class="h-full w-full"></div>
</div>
<slot/>