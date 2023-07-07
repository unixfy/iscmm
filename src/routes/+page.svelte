<script>
    import Go511ItemCard from "$lib/Go511ItemCard.svelte";
    import LoadingAlert from "$lib/LoadingAlert.svelte";
    import 'iconify-icon';
    import Sign from "$lib/Sign.svelte";

    export let data;
</script>

<Sign color="green">
    <div>
        <h1 class="flex font-extrabold">
            ISCMM
            <iconify-icon class="ml-auto" icon="el:arrow-right"></iconify-icon>
        </h1>
        <p class="uppercase text-md">Interactive SoCal Mobility Map</p>
    </div>
</Sign>

<hr class="my-4">

<div class="flex-col space-y-4">
    <p class="font-bold text-mutcd-green">
        This is a website that helps you learn about mobility options in Southern California.
        Browse the map to find points of transportation interest across Southern California.
    </p>

    <p>
        While every effort is made to be accurate, problems might exist. If you find a problem, please
        <a href="https://unixfy.net/contact" target="_blank">contact me</a>.
    </p>

    <p>
        The data in this website is fetched from <a href="https://www.openstreetmap.org/" target="_blank"
                                                    rel="noreferrer">OpenStreetMap</a>, using the Overpass API and
        Overpass Query Language. Since OSM is a crowdsourced database, some data may be inaccurate and/or inconsistent.
        In these cases, I recommend contributing to OpenStreetMap.
    </p>

    <hr>

    <!--    Collapsible area for traffic alerts - open by default -->
    <div class="collapse collapse-arrow rounded-none">
        <input type="checkbox" checked class="min-h-0"/>
        <div class="collapse-title px-0 min-h-0">
            <h2>
                <iconify-icon inline icon="carbon:traffic-cone"></iconify-icon>
                Traffic Alerts
            </h2>
        </div>
        <div class="collapse-content p-0">
            {#await data.streamed.go511Data}
                <LoadingAlert/>
            {:then go511Items}
                <div class="flex flex-col space-y-4">
                    {#each go511Items as go511Item}
                        <Go511ItemCard {go511Item}/>
                    {/each}
                    <p class="text-sm italic">
                        {go511Items.length} items retrieved.
                    </p>
                </div>
            {:catch error}
                <p>{error}</p>
            {/await}
        </div>
    </div>
</div>