<script>
    import {page} from "$app/stores";
    import 'iconify-icon';
</script>

<div class="mt-2">
    <h1>
        {#if $page.route.id.includes("/freeway-exit/")}
            <iconify-icon inline icon="mdi:highway"></iconify-icon>
            Freeway Exit
        {:else if $page.route.id.includes("/transit-station/")}
            <iconify-icon inline icon="material-symbols:train"></iconify-icon>
            Transit Station
        {/if}
        Detail
    </h1>
    <slot/>

    <!--Button to return home-->
    <a href="/" class="btn btn-primary">Return home</a>
</div>