<script>
    export let color;
    export let hcenter;
    export let vcenter;
</script>

<div class="sign-wrapper">
    <div class="sign" class:sign-green={color === "green"} class:sign-black={color === "black"} class:sign-orange={color === "orange"}
         class:sign-blue={color === "blue"} class:items-center={hcenter} class:justify-center={vcenter}>
        <slot/>
    </div>
</div>
