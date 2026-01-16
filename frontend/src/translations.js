export const translations = {
  en: {
    title: "ExaLore", 
    kb_title: "Knowledge Vault", 
    upload_btn: "Upload Data",
    upload_processing: "Indexing...",
    no_docs: "The Void is empty.\nUpload documents to fill the Lore.",
    powered_by: "Core: LangGraph & Llama 3",
    input_placeholder: "Query the Lore...",
    disclaimer: "ExaLore generates insights based on context. Verify sources.",
    error_server: "Connection severed.",
    error_upload: "Ingestion failed.",
    success_upload: (name, chunks) => `**"${name}"** absorbed into the Lore! (${chunks} vectors)`,
    initial_greeting: "I am ExaLore. Give me context, and I shall provide answers.",
    chunks: "vectors"
  },
  ru: {
    title: "ExaLore", 
    kb_title: "Хранилище Знаний",
    upload_btn: "Загрузить данные",
    upload_processing: "Индексация...",
    no_docs: "Пустота.\nЗагрузите документы, чтобы наполнить ExaLore.",
    powered_by: "Ядро: LangGraph & Llama 3",
    input_placeholder: "Запросить знание...",
    disclaimer: "ExaLore генерирует ответы на основе контекста. Проверяйте факты.",
    error_server: "Связь потеряна.",
    error_upload: "Ошибка загрузки.",
    success_upload: (name, chunks) => `**"${name}"** поглощен в ExaLore! (${chunks} векторов)`,
    initial_greeting: "Я ExaLore. Дай мне контекст, и я дам тебе ответы.",
    chunks: "векторов"
  }
};