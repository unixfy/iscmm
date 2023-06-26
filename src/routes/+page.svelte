<script>
    import Go511ItemCard from "$lib/Go511ItemCard.svelte";

    export let data;
</script>
<h1>This is <span class="font-bold text-green-800">ISCMM</span></h1>
<h2>Interactive SoCal Mobility Map</h2>

<hr class="my-4">

<div class="flex-col space-y-4">
    <p class="font-bold text-green-800">
        This is a website that helps you learn about mobility options in Southern California.
        Browse the map to find points of transportation interest across Southern California.
    </p>

    <p>
        While every effort is made to be accurate, problems might exist. If you find a problem, please
        <a href="https://unixfy.net/contact" target="_blank">contact Unixfy</a>. Thanks!
    </p>

    <p>
        The data in this website is fetched from <a href="https://www.openstreetmap.org/" target="_blank"
                                                    rel="noreferrer">OpenStreetMap</a>, using the Overpass API and
        Overpass Query Language. Since OSM is a crowdsourced database, some data may be inaccurate and/or inconsistent.
        In these cases, I recommend contributing to OpenStreetMap!
    </p>

    <p>
        Neither ISCMM nor Unixfy are affiliated with OpenStreetMap, Caltrans, Los Angeles County Metropolitan
        Transportation Agency (LACMTA; Metro), San Bernardino County Transportation Agency (SBCTA; Omnitrans), or other
        government agencies responsible for mobility in Southern California.
    </p>

    <p>
        Inspired by <a href="https://ibahm.org" target="_blank" rel="noreferrer">IBAHM</a> (Interactive Bay Area Highway
        Map).
    </p>

    <hr>

    <h2>Traffic Alerts</h2>

    {#await data.streamed.go511Data}
        Loading!
    {:then go511Items}
        {#each go511Items as go511Item}
            <Go511ItemCard {go511Item}/>
        {/each}
        <p class="text-sm italic">
            {go511Items.length} items retrieved. Data is from SoCal 511.
        </p>
    {:catch error}
        <p>{error}</p>
    {/await}
</div>