<template>
    <div>
        <template v-if="showAddressSearch">
            <form @submit.prevent>
                <h2 class="mb-4">
                    Find your address
                </h2>

                <p class="mb-3">
                    Start typing to find your address.
                </p>

                <div
                    class="dropdown"
                    v-click-outside="hideDropdown"
                    @click="showDropdown"
                >
                    <div class="form-group">
                        <label for="setupAddress">Address</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="setup.address"
                            id="setupAddress"
                            name="setupAddress"
                            @input="fetchAddresses"
                            autocomplete="off"
                        />
                    </div>
                    <div
                        class="dropdown-menu"
                        :class="{ show: dropdownVisible }"
                    >
                        <a
                            class="dropdown-item"
                            v-for="suggestion in options.suggestions"
                            :key="suggestion.id"
                            @click.prevent="onSuggestionClick(suggestion)"
                        >
                            {{ suggestion.address }}
                        </a>
                    </div>
                </div>
            </form>

            <p class="mb-3">
                <a href="#" @click.prevent="enterAddressManually"
                    >Enter address manually</a
                >
            </p>

            <div v-if="hasError" class="alert alert-danger">
                There was an error fetching address data. Please enter your
                address manually.
            </div>
            <div v-else-if="noResults" class="alert alert-warning">
                No results found, please enter your address manually.
            </div>
        </template>
        <form v-if="showAddressDetails || hasError" @submit.prevent>
            <h3 class="mb-3">Your address</h3>
            <div class="form-group">
                <label for="addressLine1">Address Line 1</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="formData.address.line1"
                    name="addressLine1"
                    id="addressLine1"
                />
            </div>
            <div class="form-group">
                <label for="addressTown">Town/City</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="formData.address.town"
                    name="addressTown"
                    id="addressTown"
                />
            </div>
            <div class="form-group">
                <label for="addressCounty">County</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="formData.address.county"
                    name="addressCounty"
                    id="addressCounty"
                />
            </div>
            <div class="form-group">
                <label for="addressPostcode">Postcode</label>
                <input
                    type="text"
                    class="form-control text-uppercase"
                    v-model="formData.address.postcode"
                    name="addressPostcode"
                    id="addressPostcode"
                />
            </div>
        </form>
    </div>
</template>

<script>
    import ClickOutside from 'vue-click-outside';
    import axios from 'axios';
    export default {
        data() {
            return {
                timer: null,
                hasError: false,
                noResults: false,
                showAddressDetails: false,
                dropdownVisible: false,
                showAddressSearch: true,
                setup: {
                    address: ''
                },
                options: {
                    suggestions: []
                },
                formData: {
                    address: {}
                }
            };
        },
        methods: {
            fetchAddresses() {
                if (this.setup.address === '') {
                    this.hideDropdown();
                    return;
                }

                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    if (!this.setup.address) {
                        this.options.suggestions = [];
                        return;
                    }

                    axios
                        .get(
                            `https://api.getAddress.io/autocomplete/${this.setup.address}?api-key=3BmZi5WZCUWa7FsF0moFEg28724&expand=true`
                        )
                        .then((res) => {
                            this.hasError = false;
                            this.options.suggestions = res.data.suggestions;
                            this.showDropdown();
                        })
                        .catch((err) => {
                            this.hasError = true;
                            console.log(err);
                        });
                }, 300);
            },
            onSuggestionClick(suggestion) {
                const id = suggestion.id;
                const address = suggestion.address;
                axios
                    .get(
                        `https://api.getAddress.io/get/${id}?api-key=3BmZi5WZCUWa7FsF0moFEg28724&expand=true`
                    )
                    .then((res) => {
                        this.hasError = false;
                        this.setup.address = address;
                        this.populateAddress(res.data);
                    })
                    .catch((err) => {
                        this.hasError = true;
                        console.log(err);
                    });
            },
            populateAddress(address) {
                this.formData.address = {
                    line1: address.line_1,
                    town: address.town_or_city,
                    county: address.county,
                    postcode: address.postcode
                };
                this.options.suggestions = [];
                this.dropdownVisible = false;
                this.showAddressDetails = true;
            },
            showDropdown() {
                if (
                    this.options.suggestions &&
                    this.options.suggestions.length
                ) {
                    this.dropdownVisible = true;
                }
            },
            hideDropdown() {
                this.dropdownVisible = false;
            },
            enterAddressManually() {
                this.setup.address = '';
                this.formData.address = {};
                this.showAddressDetails = true;
                this.showAddressSearch = false;
            }
        },
        directives: {
            ClickOutside
        }
    };
</script>

<style>
    .dropdown-menu {
        width: 100%;
    }

    .dropdown-item {
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
