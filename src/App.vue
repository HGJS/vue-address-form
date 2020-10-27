<template>
    <div id="app">
        <section class="header">
            <div class="container">
                <h1 class="mb-4">
                    <router-link to="/">
                        Address form
                    </router-link>
                </h1>
                <div class="row">
                    <div class="col-12 mb-4">
                        <router-link
                            to="/postcode-lookup"
                            class="btn btn-primary btn-block"
                            >Address form with house number and postcode
                            search</router-link
                        >
                    </div>
                    <div class="col-12 mb-4">
                        <router-link
                            to="/autocomplete"
                            class="btn btn-primary btn-block"
                            >Address form with autocomplete
                            suggestions</router-link
                        >
                    </div>
                </div>
                <p class="mb-0">
                    By
                    <a
                        href="https://samhellewell.me/"
                        target="_blank"
                        rel="noopener"
                        >Sam Hellewell</a
                    >
                </p>
            </div>
        </section>
        <div class="section">
            <div class="container">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'App'
    };
</script>

<style>
    .header {
        background-color: whitesmoke;
        color: #212529;
        padding: 60px 0;
    }

    .header h1 {
        font-size: 32px;
    }

    .header h1 a,
    .header p a {
        color: #212529;
        text-decoration: none;
    }

    .header h1 a:hover,
    .header h1 a:active,
    .header h1 a:focus,
    .header p a:hover,
    .header p a:active,
    .header p a:focus {
        color: #0069d9;
        text-decoration: none;
    }

    .section {
        padding: 60px 0;
    }
</style>
