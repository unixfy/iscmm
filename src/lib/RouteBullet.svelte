<script>
    export let ref;
    export let background;
</script>

<div class="px-4 py-4 rounded-full font-bold leading-4 border-base-100" class:border={!background}
      style="background-color: {background}">{ref}</div>