<script>
    import "../app.css";

    // fonts
    import "@fontsource/overpass/400.css";
    import "@fontsource/overpass/700.css";

    import "@fontsource/ibm-plex-sans/400.css";
    import "@fontsource/ibm-plex-sans/700.css";

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

            // add each exit to the map
            exits.forEach(exit => {
                // generate the popup and tooltip strings
                let popupString = `This is <b>Exit ${exit.tags.ref}</b>`
                let tooltipString = `Exit ${exit.tags.ref}`

                // if destination is defined, add the destination to the popup
                if (exit.tags.destination) {
                    popupString += ` for ${exit.tags.destination}`
                    tooltipString += ` - ${exit.tags.destination}`
                }

// if freeway number is defined, add it to the popup
                if (exit.tags.fwy_number) {
                    popupString += ` on ${exit.tags.fwy_number}`
                }

                //if freeway name is defined, add it to the popup
                if (exit.tags.fwy_name) {
                    popupString += ` (${exit.tags.fwy_name})`
                }

                // Add a "learn more" link to the popup
                popupString += `<a href="/freeway-exit/${exit.id}" class="block">Learn more</a>`

                const marker = leaflet.circleMarker([exit.lat, exit.lon])
                    .addTo(map)
                    .bindPopup(popupString, {
                        className: 'exit-popup'
                    })
                    .bindTooltip(tooltipString, {
                        direction: 'right',
                        className: 'exit-tooltip'
                    });
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

<div class="h-screen w-screen flex flex-col lg:flex-row">
    <!--    Page content -->
    <div class="p-4 lg:p-8 lg:w-1/3">
        <!--        Show loading if loading -->
        {#await data.streamed.exits}
            <div class="alert alert-info mb-4">
                <span class="loading loading-dots loading-md"></span>
                <p>
                    <b>Please wait</b> while we load the data.
                </p>
            </div>
        {:catch error}
            <div class="alert alert-error mb-4">
                <p>An error has occurred: {error}</p>
            </div>
        {/await}

        <!--    Slot -->
        <div>
            <slot/>
        </div>
        <!--        Footer -->
        <hr class="my-4">
        <p class="italic">Copyright &copy; {new Date().getFullYear()} Unixfy. We run on SvelteKit and
            OpenStreetMaps.</p>
    </div>
    <!--    Map -->
    <div class="lg:w-2/3 h-full w-full">
        <div bind:this={mapElement} class="h-full w-full"></div>
    </div>
</div>

