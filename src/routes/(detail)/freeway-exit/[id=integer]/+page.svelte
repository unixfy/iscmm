<script>
    import 'iconify-icon';
    import Sign from "$lib/Sign.svelte";

    export let data;
</script>

<div class="sign-cluster">
    <Sign color="green">
        <p class="ml-auto border border-2 rounded-xl px-2 py-1 mb-4">
            <span class="uppercase">Exit</span>
            <span class="text-2xl font-bold">{data.exit.ref}</span>
        </p>

        <div class="font-bold text-3xl flex justify-between">
            <div>
                <p>
                    {#if data.exit.destination}
                        {data.exit.destination}
                    {:else}
                        Unnamed Exit
                    {/if}
                </p>

                {#if data.exit.destination_ref}
                    <p class="text-sm">
                        {#if data.exit.destination_symbol}
                            {#each data.exit.destination_symbol as symbol}
                                <img src="{symbol}"
                                     class="inline max-h-12 mr-2"
                                     alt='Symbol for {data.exit.destination_ref}'/>
                            {/each}
                        {/if}
                        {data.exit.destination_ref}
                    </p>
                {/if}
            </div>

            <iconify-icon width="1.5em" icon="icomoon-free:arrow-up-right"></iconify-icon>
        </div>
    </Sign>

    <!--        Show freeway number and/or name if available -->
    {#if data.exit.freeway_number || data.exit.freeway_name}
        <div class="flex gap-2">
            <div>
                <Sign color="green" hcenter vcenter>
                    {#if data.exit.freeway_symbol}
                        {#each data.exit.freeway_symbol as symbol}
                            <img src="{symbol}" class="w-16"
                                 alt="Symbol for {data.exit.freeway_number}"/>
                        {/each}
                        {#if data.exit.freeway_direction}
                                                    <span class="text-2xl uppercase font-bold">
                                    {data.exit.freeway_direction}
                                    </span>
                        {/if}

                    {/if}
                </Sign>
            </div>
            <div class="w-full">
                <Sign color="blue" vcenter>
                    {#if data.exit.freeway_number}
                        <p class="font-bold text-4xl">
                            {data.exit.freeway_number}
                        </p>
                    {/if}
                    {#if data.exit.freeway_name}
                        <p class="text-xl">{data.exit.freeway_name}</p>
                    {/if}
                </Sign>
            </div>
        </div>
    {/if}
</div>

<!--    Modal to show raw JSON -->
<button class="btn" onclick="json_modal.showModal()">View raw JSON</button>
<dialog id="json_modal" class="modal">
    <form method="dialog" class="modal-box w-full">
        <button class="btn btn-sm btn-circle btn-neutral absolute right-4 top-4">✕</button>
        <h3 class="font-bold text-lg">Raw JSON from Overpass API</h3>
        <p class="py-4 font-mono break-all">
            {JSON.stringify(data.exit)}
        </p>
        <p class="text-sm">id: {data.id}</p>
    </form>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>