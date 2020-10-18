<template>
    <div>
        <form @submit.prevent="fetchAddresses">
            <h3 class="mb-3">Find your address</h3>
            <div class="form-group mb-3">
                <label for="setupHouseNumber">House Number (optional)</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="setup.houseNumber"
                    id="setupHouseNumber"
                    name="setupHouseNumber"
                />
            </div>
            <div class="form-group mb-3">
                <label for="setupPostcode">Postcode</label>
                <input
                    type="text"
                    class="form-control text-uppercase"
                    v-model="setup.postcode"
                    id="setupPostcode"
                    name="setupPostcode"
                />
            </div>
            <div class="form-group mb-3">
                <button class="btn btn-primary">
                    Find Address
                </button>
            </div>
            <div
                v-if="showAddressSelect && !hasError && !noResults"
                class="form-group mb-3"
            >
                <label for="formDataAddresses">Choose Address</label>
                <select
                    name="formDataAddresses"
                    id="formDataAddresses"
                    class="form-control"
                    @change="populateAddress()"
                    ref="formDataAddresses"
                >
                    <option value="" selected disabled>
                        {{ addressFirstOptionText }}</option
                    >
                    <option
                        v-for="(address, index) in options.addresses"
                        :key="address.formatted_address[0]"
                        :value="index"
                    >
                        {{ address.line_1 }}, {{ address.town_or_city }},
                        {{ address.county }}
                    </option>
                </select>
            </div>
        </form>

        <div v-if="hasError" class="alert alert-danger mb-3">
            There was an error fetching address data. Please enter your address
            manually.
        </div>
        <div v-else-if="noResults" class="alert alert-warning mb-3">
            No results found, please enter your address manually.
        </div>
        <form v-if="showAddressDetails || hasError">
            <h3 class="mb-3">Your address</h3>
            <div class="form-group mb-3">
                <label for="addressLine1">Address Line 1</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="formData.address.line1"
                    name="addressLine1"
                    id="addressLine1"
                />
            </div>
            <div class="form-group mb-3">
                <label for="addressTown">Town/City</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="formData.address.town"
                    name="addressTown"
                    id="addressTown"
                />
            </div>
            <div class="form-group mb-3">
                <label for="addressCounty">County</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="formData.address.county"
                    name="addressCounty"
                    id="addressCounty"
                />
            </div>
            <div class="form-group mb-3">
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
    import axios from 'axios';
    export default {
        data() {
            return {
                hasError: false,
                noResults: false,
                showAddressDetails: false,
                showAddressSelect: false,
                previousPostcode: '',
                previousHouseNumber: '',
                setup: {
                    houseNumber: '',
                    postcode: ''
                },
                options: {
                    addresses: []
                },
                formData: {
                    address: {}
                }
            };
        },
        computed: {
            addressFirstOptionText() {
                if (this.options.addresses.length > 0) {
                    return `${this.options.addresses.length} Addresses Found`;
                } else {
                    return '';
                }
            }
        },
        methods: {
            fetchAddresses() {
                console.log();
                if (this.setup.postcode === this.previousPostcode) {
                    if (this.setup.houseNumber || this.previousHouseNumber) {
                        if (
                            this.setup.houseNumber === this.previousHouseNumber
                        ) {
                            console.log('Same postcode and house number');
                            return;
                        }
                    } else {
                        console.log('Same postcode');
                        return;
                    }
                }

                this.formData.address = {};
                this.options.addresses = [];
                if (this.$refs.formDataAddresses) {
                    this.$refs.formDataAddresses.value = '';
                }
                let request = `https://api.getAddress.io/find/${this.setup.postcode}?api-key=3BmZi5WZCUWa7FsF0moFEg28724&expand=true`;
                if (this.setup.houseNumber) {
                    request = `https://api.getAddress.io/find/${this.setup.postcode}/${this.setup.houseNumber}?api-key=3BmZi5WZCUWa7FsF0moFEg28724&expand=true`;
                }
                axios
                    .get(request)
                    .then((res) => {
                        this.hasError = false;
                        this.options.addresses = res.data.addresses;
                        this.checkAddressesTotal();
                    })
                    .catch((err) => {
                        this.hasError = true;
                        console.log(err);
                    });

                this.previousHouseNumber = this.setup.houseNumber;
                this.previousPostcode = this.setup.postcode;
            },
            checkAddressesTotal() {
                if (this.options.addresses.length === 1) {
                    this.populateAddress(1);
                    this.showAddressSelect = false;
                    this.noResults = false;
                } else if (this.options.addresses.length === 0) {
                    this.noResults = true;
                    this.showAddressDetails = true;
                } else {
                    this.noResults = false;
                    this.showAddressSelect = true;
                }
            },
            populateAddress(total) {
                let index = 0;
                if (total !== 1) {
                    if (
                        this.$refs.formDataAddresses &&
                        this.$refs.formDataAddresses.value
                    ) {
                        index = this.$refs.formDataAddresses.value;
                    } else {
                        index = 0;
                    }
                }
                const selectedAddress = this.options.addresses[index];
                this.formData.address = {
                    line1: selectedAddress.line_1,
                    town: selectedAddress.town_or_city,
                    county: selectedAddress.county,
                    postcode: this.setup.postcode
                };
                this.showAddressDetails = true;
            }
        }
    };
</script>
