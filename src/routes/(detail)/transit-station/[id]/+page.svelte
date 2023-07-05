<script>
    import RouteBullet from "$lib/RouteBullet.svelte";
    import ErrorAlert from "$lib/ErrorAlert.svelte";

    export let data;
</script>

{#await data.streamed.station}
    <div class="sign-loading"></div>
{:then station}
    <div class="sign-cluster">
        <div class="sign sign-black flex flex-col space-y-4">
            <div>
                <p class="text-2xl font-bold break-words">{station.name}</p>

                {#if station.network}
                    <p>{station.network}</p>
                {/if}
            </div>

            <div class="my-auto flex gap-2 flex-wrap">
                <!--                    Route bullets -->
                {#each station.routes as route}
                    <RouteBullet ref={route.ref} background={route.colour}/>
                {/each}
            </div>

            {#if station.operator}
                <p class="italic text-sm">Station operated by {station.operator}</p>
            {/if}
        </div>

        {#each station.routes as route}
            <div class="sign sign-blue">
                <p class="text-2xl font-bold">{route.network}: {route.ref} Line</p>

                <ul class="list-disc list-inside">
                    {#each route.destinations as destination}
                        <li>
                            <span class="-ml-2">
                            {destination.from} ➡ {destination.to}
                                {#if destination.via}
                                    via {destination.via}
                                {/if}
                            </span>
                        </li>
                    {/each}
                </ul>

                <hr class="my-2"/>
                <p class="italic text-sm">Operated by {route.operator}</p>

            </div>
        {:else}
            <div class="alert shadow-md">
                <p>This station has no regularly scheduled fixed-route transit service.</p>
            </div>

        {/each}
    </div>

    <!--    Modal to show raw JSON -->
    <button class="btn" onclick="json_modal.showModal()">View raw JSON</button>
    <dialog id="json_modal" class="modal">
        <form method="dialog" class="modal-box w-full">
            <button class="btn btn-sm btn-circle btn-neutral absolute right-4 top-4">✕</button>
            <h3 class="font-bold text-lg">Raw JSON from Overpass API</h3>
            <p class="py-4 font-mono break-all">
                {JSON.stringify(station)}
            </p>
            <p class="text-sm">id: {data.id}</p>
        </form>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
{:catch error}
    <ErrorAlert {error}/>
{/await}