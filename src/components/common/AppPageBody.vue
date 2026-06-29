<template>
    <div class="main-container">
        <div class="main-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageBody"
    }
</script>

<style scoped>
    .main-container {
        margin-top: 60px;
        display: flex;
        justify-content: center;
        background-color: #f5f7fa;
        min-height: calc(100vh - 60px);
        padding: 20px 0;
    }
    
    .main-content {
        width: 1200px;
        max-width: 95%;
        background-color: #ffffff;
        min-height: 80vh;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 20px;
        box-sizing: border-box;
    }
    
    /* 响应式调整 */
    @media (max-width: 768px) {
        .main-container {
            padding: 10px 0;
        }
        
        .main-content {
            padding: 15px;
            border-radius: 6px;
        }
    }
</style>