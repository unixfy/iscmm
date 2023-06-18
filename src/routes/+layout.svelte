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

            // add each exit to the map
            exits.forEach(exit => {
                const marker = leaflet.circleMarker([exit.lat, exit.lon]).addTo(map).bindPopup('blah');
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
        <p class="italic">Copyright &copy; {new Date().getFullYear()} Unixfy. We run on SvelteKit and OpenStreetMaps.</p>
    </div>
    <!--    Map -->
    <div class="lg:w-2/3 h-full w-full">
        <div bind:this={mapElement} class="h-full w-full"></div>
    </div>
</div>

