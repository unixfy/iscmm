<script>
    export let go511Item;
</script>

<div class="card bg-base-200 shadow-lg">
    <div class="card-body p-4">
        <div class="card-title">
            <div>
                <!--    Badges -->
                {#if go511Item.type === "Alert" || go511Item.type === "Incident"}
                    <div class="badge badge-warning">{go511Item.type}</div>
                {:else if go511Item.type === "Road Work"}
                    <div class="badge badge-info">{go511Item.type}</div>
                {:else if go511Item.type === "Closure"}
                    <div class="badge badge-error">{go511Item.type}</div>
                {:else}
                    <div class="badge badge-neutral">{go511Item.type}</div>
                {/if}

                <!--Emergency indicator-->
                {#if go511Item.emergency}
                    <div class="badge badge-error">Emergency</div>
                {/if}

                <p class="inline">
                    <!--                    Freeway -->
                    {#if go511Item.freeway}
                        {go511Item.freeway}
                    {/if}

                    <!-- Direction of travel-->
                    {#if go511Item.direction}
                        {go511Item.direction}
                    {/if}

                    <!--County (if available)-->
                    {#if go511Item.county}
                        {#if go511Item.freeway}
                            in
                        {/if}
                        {go511Item.county} County
                    {/if}

                    <!--Location-->
                    {#if go511Item.location}
                        {go511Item.location}
                    {/if}
                </p>
            </div>
        </div>


        <!--        Incident start date -->
        <p class="text-sm italic">
            {go511Item.start}
        </p>

        <!--        Incident description -->
        <p>
            <b>{go511Item.description}</b>
        </p>

        <!--        Location -->
        {#if go511Item.location}
            <p>
                <b>Location:</b> {go511Item.location}
            </p>
        {/if}

        <!--Lanes affected-->
        {#if go511Item.lanes}
            <p>
                <b>Lane(s):</b> {go511Item.lanes}
            </p>
        {/if}

        <!--More info link if available-->
        {#if go511Item.url}
            <a href="{go511Item.url}" target="_blank" class="btn btn-neutral btn-sm">More info</a>
        {/if}
    </div>
</div>