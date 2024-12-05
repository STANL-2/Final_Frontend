<template>
    <div class="dashboard">
        <!-- Top Summary Section -->
        <div class="summary">
            <div class="summary-item">계약서 <span>6건</span></div>
            <div class="summary-item">영수증 <span>7건</span></div>
            <div class="summary-item">현황 <span>10건</span></div>
            <div class="summary-item">문서함 <span>3건</span></div>
        </div>

        <!-- Middle Content Section -->
        <div class="content">
            <div class="content-item text-content">
                <p>문서 내용 표시</p>
            </div>
            <div class="content-item blank-content"></div>
            <div class="content-item grid-content">
                <div class="grid">
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                    <div class="grid-item"></div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>PPL 및 메시지 표시</p>
        </div>
    </div>
</template>

<script></script>

<style scoped>
.dashboard {
    padding: 20px;
    background-color: #f9f9f9;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Summary Section */
.summary {
    display: flex;
    justify-content: space-around;
    background-color: #ffffff;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-item {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.summary-item span {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #666;
}

/* Content Section */
.content {
    display: flex;
    gap: 20px;
}

.content-item {
    flex: 1;
    background-color: #ffffff;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.text-content {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #555;
}

.blank-content {
    background-color: #f0f0f0;
}

.grid-content .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.grid-item {
    height: 50px;
    background-color: #e0e0e0;
    border: 1px solid #ccc;
}

/* Footer Section */
.footer {
    text-align: center;
    font-size: 14px;
    color: #777;
    padding: 10px;
}
</style>