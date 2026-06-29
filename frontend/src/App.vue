<template>
    <div id="app" :class="{'project-space': isSpaceMode, 'project-market': isMarketMode}">
        <router-view></router-view>
    </div>
</template>

<script>
    import './assets/theme.css';
    import './assets/theme-space.css';

    export default {
        name: 'App',
        computed: {
            isSpaceMode() {
                return this.$route.query && this.$route.query.project === 'space';
            },
            isMarketMode() {
                return !this.$route.query || this.$route.query.project !== 'space';
            }
        },
        watch: {
            '$route.query.project': {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.$projectMode = val;
                    }
                }
            }
        },
        created() {
            this.$projectMode = this.$route.query && this.$route.query.project || '';
        }
    };
</script>

<style>
    html, body, #app{
        overflow: visible;
        background-color: #f6f6f6;
    }
</style>