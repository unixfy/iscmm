<script>
    import ErrorAlert from "$lib/ErrorAlert.svelte";
    import Icon from "@iconify/svelte";

    export let data;
</script>

<h1>Freeway Exit Detail</h1>

{#await data.streamed.exit}
    <div class="bg-gray-300 animate-pulse h-56 rounded-lg my-8"></div>
{:then exit}
    <div class="sign-cluster">
        <div class="sign sign-green">
            <div class="flex flex-col space-y-2">
                <p class="ml-auto border rounded-lg px-2 py-1 mb-4">
                    <span class="uppercase">Exit</span>
                    <span class="text-2xl font-bold">{exit[0].tags.ref}</span>
                </p>

                <div class="font-bold text-3xl flex justify-between">
                    <div>
                        <p>
                            {#if exit[0].tags.destination}
                                {exit[0].tags.destination}
                            {:else}
                                Unnamed Exit
                            {/if}
                        </p>

                        {#if exit[0].tags["destination:ref"]}
                            <p class="text-sm">
                                {#if exit[0].tags.destination_symbol}
                                    <img src="{exit[0].tags.destination_symbol}"
                                         class="inline max-h-12 mr-2"
                                         alt='Symbol for {exit[0].tags["destination:ref"]}'/>
                                {/if}
                                {exit[0].tags["destination:ref"]}</p>
                        {/if}
                    </div>

                    <Icon class="my-auto" width="1.5em" icon="icomoon-free:arrow-up-right"/>
                </div>
            </div>
        </div>

        <!--        Show freeway number and/or name if available -->
        {#if exit[0].tags.fwy_number || exit[0].tags.fwy_name}

            <div class="sign sign-blue">
                <div class="flex space-x-5">
                    {#if exit[0].tags.fwy_symbol}
                        <div class="w-1/4 my-auto"><img src="{exit[0].tags.fwy_symbol}" class="inline max-h-36"
                                                        alt="Symbol for {exit[0].tags.fwy_number}"/></div>
                    {/if}

                    <div class="flex flex-col m-auto">
                        {#if exit[0].tags.fwy_number}
                            <p class="font-bold text-4xl">{exit[0].tags.fwy_number}</p>
                        {/if}
                        {#if exit[0].tags.fwy_name}
                            <p class="text-xl">{exit[0].tags.fwy_name}</p>
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
    <ErrorAlert {error}/>
{/await}

<!--Button to return home-->
<a href="/" class="btn btn-primary">Return home</a>