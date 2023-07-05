<script>
    import 'iconify-icon'

    export let go511Item;
</script>

<div class="card bg-base-200 shadow-lg">
    <div class="card-body p-4">
        <div class="card-title">
            <!--            Icon slot -->
            <div>
                {#if go511Item.type === "Alert"}
                    <iconify-icon class="text-warning text-3xl" inline icon="carbon:warning-filled"></iconify-icon>
                {:else if go511Item.type === "Incident"}
                    <iconify-icon class="text-warning text-3xl" inline icon="carbon:traffic-flow-incident"></iconify-icon>
                {:else if go511Item.type === "Road Work"}
                    <iconify-icon class="text-info text-3xl" inline icon="carbon:construction"></iconify-icon>
                {:else if go511Item.type === "Closure"}
                    <iconify-icon class="text-error text-3xl" inline icon="carbon:close-filled"></iconify-icon>
                {/if}
            </div>
            <div>
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


        <div>
            <!--    Badges -->
            {#if go511Item.type === "Alert" || go511Item.type === "Incident"}
                <div class="badge badge-warning">
                    {go511Item.type}</div>
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
        </div>

        <!--        Incident start date -->
        {#if go511Item.start}
            <p class="text-sm italic">
                reported {go511Item.startDistanceToNow} ago:
                {go511Item.start}

                {#if go511Item.end}
                    - {go511Item.end}
                {/if}
            </p>
        {/if}

        <!--        Incident description -->
        <p>
            <iconify-icon inline icon="carbon:text-align-center"/>
            <b>Description: </b> {go511Item.description}
        </p>

        <!--        Location -->
        {#if go511Item.location}
            <p>
                <iconify-icon inline icon="carbon:location-filled"/>
                <b>Location:</b> {go511Item.location}
            </p>
        {/if}

        <!--Lanes affected-->
        {#if go511Item.lanes}
            <p>
                <iconify-icon inline icon="carbon:traffic-flow"/>
                <b>Lane(s):</b> {go511Item.lanes}
            </p>
        {/if}

        <!--More info link if available-->
        {#if go511Item.url}
            <a href="{go511Item.url}" target="_blank" class="btn btn-neutral btn-sm">More info
                <iconify-icon icon="carbon:arrow-up-right"/>
            </a>
        {/if}
    </div>
</div>