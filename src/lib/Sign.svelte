<script>
    export let color;
    export let hcenter;
    export let vcenter;
    export let expand;
</script>

<div class="sign-wrapper" class:flex-1={expand}>
    <div class="sign" class:sign-green={color === "green"} class:sign-black={color === "black"} class:sign-orange={color === "orange"}
         class:sign-blue={color === "blue"} class:items-center={hcenter} class:justify-center={vcenter}>
        <slot/>
    </div>
</div>
