<template>
    <div class="search-container">
      <!-- 필드 그룹을 순차적으로 렌더링 -->
      <template v-for="(fieldGroup, rowIndex) in fields" :key="rowIndex">
        <div class="form-row">
          <template v-for="(field, index) in fieldGroup" :key="`${rowIndex}_${index}`">
            <div class="form-group">
              <div class="label">{{ field.label }}</div>
  
              <!-- Input 필드 -->
              <template v-if="field.type === 'input'">
                <input type="text" v-model="formData[field.model]" :placeholder="field.placeholder" class="form-input" />
              </template>

              <!-- inputWithButton 필드 -->
              <template v-if="field.type === 'inputWithButton'">
                <div class="search-input">
                  <input type="text" disabled v-model="formData[field.model]" :placeholder="field.placeholder" class="form-input" />
                  <button class="search-button" @click="openModal(rowIndex, index)">
                    <span class="search-icon pi pi-search"></span>
                  </button>
                </div>
              </template>
            </div>
          </template>
        </div>
        <div v-if="rowIndex < fields.length - 1" class="row-divider"></div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, defineExpose, onMounted } from 'vue';
  
  const emit = defineEmits(['open-modal']);
  const props = defineProps({
    fields: {
      type: Array,
      required: true,
      default: () => [],
    },
    placeholder: String
  });
  
  // formData는 검색폼의 값들을 저장하는 객체
  const formData = ref({});
  
  // formData 초기화
  function initializeFormData() {
    formData.value = {};
    props.fields.forEach((fieldGroup) => {
      fieldGroup.forEach((field) => {
        formData.value[field.model] = field.default || ''; // 각 필드에 대한 기본값 설정
      });
    });
  }
  
  // 모달을 열 때 호출되는 메서드
  function openModal(rowIndex, index) {
    const field = props.fields[rowIndex][index]; // 필드 객체를 가져옴
    console.log("openModal called for:", field);
    emit('open-modal', field.model); // 부모 컴포넌트에 'open-modal' 이벤트를 발생시켜 모달을 엶
  }
  
  // 부모 컴포넌트에서 호출하여 필드 값을 업데이트
  function updateFieldValue(fieldModel, value) {
    if (formData.value[fieldModel] !== undefined) {
      formData.value[fieldModel] = value; // 필드 값 업데이트
    } else {
      console.error(`Field ${fieldModel} not found in formData.`);
    }
  }
  
  // 컴포넌트 초기화 시 formData를 초기화
  onMounted(() => {
    initializeFormData();
  });
  
  // 부모 컴포넌트에서 해당 필드를 외부에서 사용할 수 있도록 expose
  defineExpose({
    formData,
    updateFieldValue,
  });
  </script>
  
  <style scoped>
  *,
  *::before,
  *::after {
      box-sizing: border-box;
  }
  
  html,
  body {
      overflow-x: hidden;
  }
  
  .search-container {
      max-width: 100%;
      overflow-x: hidden;
      border: 1.5px solid #EEEEEE;
      background-color: #F8F8F8;
  }
  
  .form-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      /* grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); */
      /* 항상 4열 고정 */
      gap: 1rem;
      margin: 10px 0;
      padding: 0 25px 0 0px;
  }
  
  .form-group {
      display: flex;
      align-items: center;
      width: 100%;
  }
  
  .form-group.placeholder {
      visibility: hidden;
      /* 빈 칸 숨김 */
  }
  
  .label {
      min-width: 6rem;
      font-size: 13px;
      color: #333;
      text-align: left;
      padding-right: 8px;
      padding-left: 1.5rem;
  }
  
  .form-input,
  .form-select {
      height: 25px;
      border: 1px solid #ddd;
      padding: 0 8px;
      font-size: 13px;
      box-sizing: border-box;
      border-radius: 0px;
  }
  
  .form-input {
      width: 10.5rem;
  }
  
  .date-range {
      display: flex;
      align-items: center;
      width: 100%;
  }
  
  .date-separator {
      margin: 0 5px;
  }
  
  .search-input {
      position: relative;
  }
  
  .search-button {
      position: absolute;
      right: 0;
      top: 0;
      width: 25px;
      height: 25px;
      background: #6360AB;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
  }
  
  .search-icon {
      color: white;
      font-size: 14px;
  }
  
  .form-input:focus,
  .form-select:focus {
      outline: none;
  }
  
  .select-container {
      position: relative;
      display: inline-block;
  }
  
  .form-select {
      width: 10.5rem;
      appearance: none;
      /* 기본 브라우저 화살표 제거 */
      padding-right: 2rem;
      /* 아이콘 공간 확보 */
      border: 1px solid #ddd;
      background-color: white;
      background-image: none;
      /* 기본 배경 제거 */
      height: 25px;
      font-size: 13px;
      appearance: none;
      background-repeat: no-repeat;
      background-position: right 8px center;
  }
  
  .select-icon {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      /* 아이콘 클릭 방지 */
      font-size: 14px;
      color: #888;
  }
  
  /* 반응형 디자인: 화면이 작을 때는 열 개수를 줄입니다 */
  @media (max-width: 1024px) {
      .form-row {
          grid-template-columns: repeat(2, 1fr);
          /* 중간 화면에서는 2열 */
      }
  }
  
  @media (max-width: 768px) {
      .form-row {
          grid-template-columns: 1fr;
      }
  }
  
  .radio-group {
      display: flex;
      gap: 10px;
  }
  
  .radio-label {
      display: flex;
      align-items: center;
      font-size: 13px;
      cursor: pointer;
  }
  
  .radio-label input[type='radio'] {
      margin-right: 5px;
  }
  
  /* 행 아래 선 스타일 */
  .row-divider {
      width: 100%;
      height: 1px;
      background-color: #dddddd;
      /* 선 색상 */
      margin: 10px 0;
      /* 선 위아래 간격 */
  }
  
  .form-date {
      flex: 1;
      height: 25px;
      border: 1px solid #ddd;
      padding: 0 8px;
      font-size: 13px;
      box-sizing: border-box;
      border-radius: 0px;
      background-color: white;
      width: 10px;
  }
  
  .date-range {
      display: flex;
      align-items: center;
      width: 100%;
  }
  
  .date-separator {
      margin: 0 8px;
      font-weight: bold;
      color: #555;
  }
  </style>