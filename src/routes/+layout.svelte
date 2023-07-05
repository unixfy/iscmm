<script>
    import "../app.css";

    // fonts
    import "@fontsource/overpass/400.css";
    import "@fontsource/overpass/700.css";
    import "@fontsource/overpass/800.css";

    import "@fontsource/ibm-plex-sans/400.css";
    import "@fontsource/ibm-plex-sans/700.css";

    import {onMount, onDestroy} from 'svelte';
    import {browser} from '$app/environment';
    import {goto} from "$app/navigation";
    import ErrorAlert from "$lib/ErrorAlert.svelte";
    import LoadingAlert from "$lib/LoadingAlert.svelte";
    import {page} from "$app/stores";
    import "iconify-icon";
    import {fly} from "svelte/transition";

    export let data;

    let mapElement;
    let map;

    let contentPaneExpanded = true;

    onMount(async () => {
        if (browser) {
            // Override Array.prototype.toString to use / instead of ,
            Array.prototype.toString = function () {
                return this.join(' / ');
            };

            const leaflet = await import('leaflet');

            // Start centered at 7th St/Metro Center in Downtown Los Angeles
            map = leaflet.map(mapElement, {
                preferCanvas: true,
                minZoom: 9,
                zoomControl: false
            }).setView([34.0488664, -118.2613463], 12);

            // Add OSM tiles
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add zoom control
            leaflet.control.zoom({position: 'bottomright'}).addTo(map);

            let exits = await data.streamed.exits
            // add each exit to the map
            exits.forEach(exit => {
                // generate the  tooltip strings
                let tooltipString = `Exit ${exit.ref}`

                // if destination is defined, add the destination to the tooltip
                if (exit.destination) {
                    tooltipString += ` - ${exit.destination}`
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

            let stations = await data.streamed.stations
            // add each transit station to the map
            stations.forEach(rail => {
                let popupString = `${rail.name} - ${rail.network}`
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
    {#if contentPaneExpanded}
        <!--    Page content -->
        <div class="p-2 lg:p-6 lg:w-1/3 h-full overflow-auto absolute z-10 bg-base-100"
             transition:fly={{x: -1000, opacity:1}}>
            <!--    Noscript warning -->
            <noscript>
                <div class="font-display font-bold text-white p-8 text-3xl mb-4" style="background-color:red;">
                    It looks like you have JavaScript disabled. This site will NOT work without JavaScript enabled!
                </div>
            </noscript>

            <!--        Show loading if loading -->
            {#await Promise.all([data.streamed.exits, data.streamed.stations])}
                <LoadingAlert/>
            {:catch error}
                <ErrorAlert {error}/>
            {/await}

            <!--    Slot -->
            <div>
                <button class="btn btn-primary lg:btn-neutral mb-4 btn-block"
                        on:click={() => contentPaneExpanded = false}>
                    <iconify-icon icon="carbon:arrow-left"></iconify-icon>
                    <div>
                        Hide content
                        <!--                    Only show "Show map" text on screens smaller than lg -->
                        <span class="inline lg:hidden">/ show map</span>
                    </div>
                </button>
                <slot/>
            </div>
            <!--        Footer -->
            <hr class="my-4">
            <div class="flex flex-col space-y-2">
                <p>
                    Copyright &copy; {new Date().getFullYear()} <a href="https://alexwang.net" target="_blank"
                                                                   rel="noreferrer">Alex
                    Wang</a>. Proudly powered by SvelteKit.
                    Inspired by <a href="https://ibahm.org" target="_blank" rel="noreferrer">IBAHM</a> (Interactive Bay
                    Area
                    Highway
                    Map).
                </p>
                <p class="text-xs">
                    Disclaimer: ISCMM, Unixfy, and Alex Wang are not affiliated with OpenStreetMap, Caltrans, Los
                    Angeles
                    County Metropolitan
                    Transportation Agency (LACMTA; Metro), San Bernardino County Transportation Agency (SBCTA;
                    Omnitrans),
                    or
                    other
                    organizations responsible for mobility in Southern California.
                </p>
            </div>
        </div>
    {:else}
        <!--Content pane hidden message-->
        <div class="p-4 rounded-xl bg-base-100 absolute ml-4 z-10 mt-4 w-64 shadow-2xl"
             transition:fly={{x: -1000, opacity:1}}>
            <p class="text-2xl font-display font-extrabold text-green-800">
                ISCMM
            </p>
            <p>
                You're viewing page:
                <b>{$page.data.title}</b>
            </p>
            <button class="btn btn-neutral btn-block btn-md lg:btn-sm mt-2" on:click={() => contentPaneExpanded = true}>
                Show content
                <iconify-icon icon="carbon:arrow-right"></iconify-icon>
            </button>
        </div>
    {/if}
    <!--    Map -->
    <div bind:this={mapElement} class="h-screen w-full z-0"></div>
</div>

