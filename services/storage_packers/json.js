// реализация фрагментарного писателя, извлекателя, преобразователя log -> stream для json структур
// основные действия, которые делает такой упаковщик:
// + наложение update на структуру, в виде лога
// + сканирование и нахождение фрагментов чтобы(читать, реплицировать и находить)
// + извлечение по паттерну из найденного
// + объединение фрагментов в структуру, то есть наложение всех update, но с сохранением лога, то есть
// дефрагметация
// + разделение структуры на фрагменты, то есть фрагметация, с учётом характеристик структуры. Без этого
// + уровень держателя не сможет эффективно разбить большие структуры на части и работать  ними