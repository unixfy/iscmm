<script>
    import RouteBullet from "$lib/RouteBullet.svelte";
    import "iconify-icon";
    import Sign from "$lib/Sign.svelte";

    export let data;
</script>

<div class="sign-cluster">
    <Sign color="black">
        <div>
            <p class="text-2xl font-bold break-words">{data.station.name}</p>

            {#if data.station.network}
                <p>{data.station.network}</p>
            {/if}
        </div>

        <div class="my-auto flex gap-2 flex-wrap">
            <!--                    Route bullets -->
            {#each data.station.routes as route}
                <RouteBullet ref={route.ref} background={route.colour}/>
            {/each}
        </div>

        {#if data.station.operator}
            <p class="italic text-sm">Station operated by {data.station.operator}</p>
        {/if}
    </Sign>

    {#each data.station.routes as route}
        <Sign color="blue">
            <p class="text-2xl font-bold">{route.network}: {route.ref} Line</p>

            <ul>
                {#each route.destinations as destination}
                    <li class="font-bold">
                            {destination.from}
                                <iconify-icon inline icon="mdi:chevron-double-right"></iconify-icon>
                                {destination.to}
                                {#if destination.via}
                                    <span class="text-xs">via</span>
                                    {destination.via}
                                {/if}
                    </li>
                {/each}
            </ul>
            <p class="italic text-sm">Route operated by {route.operator}</p>
        </Sign>
    {:else}
        <Sign color="orange">
            <p>This station has no regularly scheduled fixed-route transit service.</p>
        </Sign>

    {/each}
</div>

<!--    Modal to show raw JSON -->
<button class="btn" onclick="json_modal.showModal()">View raw JSON</button>
<dialog id="json_modal" class="modal">
    <form method="dialog" class="modal-box w-full">
        <button class="btn btn-sm btn-circle btn-neutral absolute right-4 top-4">✕</button>
        <h3 class="font-bold text-lg">Raw JSON from Overpass API</h3>
        <p class="py-4 font-mono break-all">
            {JSON.stringify(data.station)}
        </p>
        <p class="text-sm">id: {data.id}</p>
    </form>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>