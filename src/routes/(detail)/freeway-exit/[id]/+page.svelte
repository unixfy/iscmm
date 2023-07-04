<script>
    import ErrorAlert from "$lib/ErrorAlert.svelte";
    import Icon from "@iconify/svelte";

    export let data;
</script>

{#await data.streamed.exit}
    <div class="sign-loading"></div>
{:then exit}
    <div class="sign-cluster">
        <div class="sign sign-green">
            <div class="flex flex-col space-y-2">
                <p class="ml-auto border rounded-lg px-2 py-1 mb-4">
                    <span class="uppercase">Exit</span>
                    <span class="text-2xl font-bold">{exit.ref}</span>
                </p>

                <div class="font-bold text-3xl flex justify-between">
                    <div>
                        <p>
                            {#if exit.destination}
                                {exit.destination}
                            {:else}
                                Unnamed Exit
                            {/if}
                        </p>

                        {#if exit.destination_ref}
                            <p class="text-sm">
                                {#if exit.destination_symbol}
                                    {#each exit.destination_symbol as symbol}
                                        <img src="{symbol}"
                                             class="inline max-h-12 mr-2"
                                             alt='Symbol for {exit.destination_ref}'/>
                                    {/each}
                                {/if}
                                {exit.destination_ref}</p>
                        {/if}
                    </div>

                    <Icon class="my-auto" width="1.5em" icon="icomoon-free:arrow-up-right"/>
                </div>
            </div>
        </div>

        <!--        Show freeway number and/or name if available -->
        {#if exit.freeway_number || exit.freeway_name}

            <div class="sign sign-blue">
                <div class="flex space-x-5">
                    {#if exit.freeway_symbol}
                        {#each exit.freeway_symbol as symbol}
                            <div class="w-1/4 my-auto"><img src="{symbol}" class="inline max-h-36"
                                                            alt="Symbol for {exit.freeway_number}"/></div>
                        {/each}
                    {/if}

                    <div class="flex flex-col m-auto">
                        {#if exit.freeway_number}
                            <p class="font-bold text-4xl">{exit.freeway_number}</p>
                        {/if}
                        {#if exit.freeway_name}
                            <p class="text-xl">{exit.freeway_name}</p>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <!--    Modal to show raw JSON -->
    <button class="btn" onclick="json_modal.showModal()">View raw JSON</button>
    <dialog id="json_modal" class="modal">
        <form method="dialog" class="modal-box w-full">
            <h3 class="font-bold text-lg">Raw JSON from Overpass API</h3>
            <p class="py-4 font-mono break-all">
                {JSON.stringify(exit)}
            </p>
            <p class="text-sm">id: {data.id}</p>
        </form>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
{:catch error}
    <ErrorAlert error={error}/>
{/await}