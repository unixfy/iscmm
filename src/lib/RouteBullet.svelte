<script>
    export let ref;
    export let background;
</script>

<div class="px-4 py-2 rounded-full font-bold border-base-100" class:border={!background}
      style="background-color: {background}">
    <p class="leading-0">{ref}</p>
</div>