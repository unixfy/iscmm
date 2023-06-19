<script>
    export let data;
</script>

<h1>Freeway exit</h1>
<span class="text-sm font-mono mb-8">id: {data.id}</span>

{#await data.streamed.exit}
    <div class="bg-gray-300 animate-pulse h-56 rounded-lg"></div>
{:then exit}
    <div class="sign sign-green">
        <!--        Show freeway number and/or name if available -->
        {#if exit[0].tags.fwy_number || exit[0].tags.fwy_name}
            <div class="flex space-x-1">
                <p>This is on</p>
                {#if exit[0].tags.fwy_symbol}
                    <div><img src="{exit[0].tags.fwy_symbol}" class="inline h-[1.5em]"
                              alt="Symbol for {exit[0].tags.fwy_number}"/></div>
                {/if}

                {#if exit[0].tags.fwy_number}
                    <p>{exit[0].tags.fwy_number}</p>
                {/if}
                {#if exit[0].tags.fwy_name}
                    <p>({exit[0].tags.fwy_name})</p>
                {/if}
            </div>
            <hr class="my-4">
        {/if}
        <div class="flex flex-col space-y-2">
            <p class="ml-auto border rounded-lg p-2">
                <span class="uppercase">Exit</span>
                <span class="text-2xl">{exit[0].tags.ref}</span>
            </p>

            <p class="font-bold text-3xl">
                {#if exit[0].tags.destination}
                    {exit[0].tags.destination}
                {:else}
                    Unnamed Exit
                {/if}

                {#if exit[0].tags["destination:ref"]}
                    <p class="text-sm">{exit[0].tags["destination:ref"]}</p>
                {/if}
        </div>
    </div>

    <!--    Modal to show raw JSON -->
    <button class="btn" onclick="json_modal.showModal()">View raw JSON</button>
    <dialog id="json_modal" class="modal">
        <form method="dialog" class="modal-box w-full">
            <h3 class="font-bold text-lg">Raw JSON from Overpass API</h3>
            <p class="py-4 font-mono break-all">
                {JSON.stringify(exit)}
            </p>
        </form>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
{:catch error}
    <div class="alert alert-error mb-4">
        <p>An error has occurred: {error}</p>
    </div>
{/await}

<!--Button to return home-->
<a href="/" class="btn btn-primary">Return home</a>