<script>
    export let ref;
    export let background;
</script>

<div class="px-4 py-2 text-xl rounded-full font-bold border-base-100 font-sans" class:border={!background}
      style="background-color: {background}">
    <p class="leading-8">{ref}</p>
</div>