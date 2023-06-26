<script>
    import "../app.css";

    // fonts
    import "@fontsource/overpass/400.css";
    import "@fontsource/overpass/700.css";

    import "@fontsource/ibm-plex-sans/400.css";
    import "@fontsource/ibm-plex-sans/700.css";

    import {onMount, onDestroy} from 'svelte';
    import {browser} from '$app/environment';
    import {goto} from "$app/navigation";
    import ErrorAlert from "$lib/ErrorAlert.svelte";
    import LoadingAlert from "$lib/LoadingAlert.svelte";
    import {page} from "$app/stores";

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
                // generate the  tooltip strings
                let tooltipString = `Exit ${exit.tags.ref}`

                // if destination is defined, add the destination to the tooltip
                if (exit.tags.destination) {
                    tooltipString += ` - ${exit.tags.destination}`
                }

                leaflet.circleMarker([exit.lat, exit.lon], {
                    color: "#006b54",
                    radius: 10,
                })
                    .addTo(map)
                    .on('click', function () {
                        goto(`/freeway-exit/${exit.id}`)
                    })
                    .bindTooltip(tooltipString, {
                        direction: 'right',
                        className: 'exit-tooltip'
                    });
            })

            let rail = await data.streamed.rail
            // add each rail station to the map
            rail.forEach(rail => {
                let popupString = `${rail.tags.name} - ${rail.tags.network}`
                leaflet.circleMarker([rail.lat, rail.lon], {
                    color: "#003f87",
                    radius: 10,
                })
                    .addTo(map)
                    .on('click', function () {
                        goto(`/transit-station/${rail.id}`)
                    })
                    .bindTooltip(popupString, {
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

<svelte:head>
    <title>{(($page.error) ? "Error" : $page.data.title || "Welcome")} | Interactive SoCal Mobility Map</title>
</svelte:head>


<div class="h-screen w-screen flex flex-col lg:flex-row overflow-hidden">
    <!--    Page content -->
    <div class="p-4 lg:p-8 lg:w-1/3 h-full overflow-auto">
        <!--        Show loading if loading -->
        {#await Promise.all([data.streamed.exits, data.streamed.rail])}
            <LoadingAlert/>
        {:catch error}
            <ErrorAlert {error}/>
        {/await}

        <!--    Slot -->
        <div>
            <slot/>
        </div>
        <!--        Footer -->
        <hr class="my-4">
        <p class="italic">Copyright &copy; {new Date().getFullYear()} Unixfy. Proudly powered by SvelteKit.</p>
    </div>
    <!--    Map -->
    <div class="lg:w-2/3 h-full w-full">
        <div bind:this={mapElement} class="h-full w-full"></div>
    </div>
</div>

