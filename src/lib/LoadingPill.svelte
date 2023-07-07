<script>
    import {fade} from "svelte/transition";
</script>

<div class="bg-base-100 rounded-full p-4 absolute left-0 lg:left-auto lg:right-0 bottom-0 lg:bottom-auto lg:top-0 z-20 flex m-4 shadow-2xl text-green-800 gap-4"
     transition:fade>
    <span class="loading loading-spinner loading-lg m-auto"></span>
    <p class="m-auto text-xl font-display font-bold">Loading...</p>
</div>