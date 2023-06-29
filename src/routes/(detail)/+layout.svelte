<script>
    import {page} from "$app/stores";
    import Icon from "@iconify/svelte";
</script>

<div class="mt-2">
    <h1>
        {#if $page.route.id.includes("/freeway-exit/")}
            <Icon class="inline" icon="mdi:highway"/>
            Freeway Exit
        {:else if $page.route.id.includes("/transit-station/")}
            <Icon class="inline" icon="material-symbols:train"/>
            Transit Station
        {/if}
        Detail
    </h1>
    <slot/>

    <!--Button to return home-->
    <a href="/" class="btn btn-primary">Return home</a>
</div>