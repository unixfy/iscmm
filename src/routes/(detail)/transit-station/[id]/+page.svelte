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
                <p class="text-2xl font-bold break-words">{station[0].tags.name}</p>
                <p>{station[0].tags.network}</p>
            </div>

            <div class="my-auto flex space-x-1">
                <!--                    Route bullets -->
                {#each station[0].routes_served as route}
                    <RouteBullet ref={route.ref} background={route.colour}/>
                {/each}
            </div>
        </div>

        {#each station[0].routes_served as route}
            <div class="sign sign-blue">
                <p class="text-2xl font-bold">{route.network}: {route.ref} Line</p>

                <div>
                    {#each route.to as dest}
                        <p>▶ to {dest}</p>
                    {/each}
                </div>

                <hr class="my-2"/>
                <p class="italic text-sm">Operated by {route.operator}</p>

            </div>
        {/each}
    </div>

    <!--    Modal to show raw JSON -->
    <button class="btn" onclick="json_modal.showModal()">View raw JSON</button>
    <dialog id="json_modal" class="modal">
        <form method="dialog" class="modal-box w-full">
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