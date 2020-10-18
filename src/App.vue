<template>
    <div id="app" class="pt-5 pb-5">
        <div class="container">
            <h1 class="mb-4">Enter your contact details</h1>
            <app-address-form />
        </div>
    </div>
</template>

<script>
    import AddressForm from './components/AddressForm';
    export default {
        name: 'App',
        components: {
            'app-address-form': AddressForm
        }
    };
</script>

<style></style>
